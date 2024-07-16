import { saveAs } from 'file-saver';
import MazeWorker from 'src/app/worker/worker?worker';
import { MessageType } from 'src/app/worker/MessageType';
import { Message } from 'src/app/worker/Message';
import { MazeOptions } from 'src/app/maze/MazeOptions';
import { toColor } from 'src/app/color/Color';
import { MazeResponse } from 'src/app/worker/MazeResponse';
import { RenderOptions } from 'src/app/render/RenderOptions';
import { useRenderStore } from 'stores/renderStore';
import { storeToRefs } from 'pinia';
import {
    DEFAULT_BACKGROUND_COLOR,
    DEFAULT_CELL_SIZE,
    DEFAULT_CROSS_PCT,
    DEFAULT_IMAGE_SIZE,
    DEFAULT_LINE_WIDTH_PCT,
    DEFAULT_LONG_PASSAGES,
    DEFAULT_LOOP_PCT,
    DEFAULT_MAZE_SIZE,
    DEFAULT_PASSAGE_WIDTH_PCT,
    DEFAULT_SOLUTION,
    DEFAULT_SOLUTION_COLOR,
    DEFAULT_SQUARE_CORNERS,
    DEFAULT_WALL_COLOR
} from 'src/app/controller/defaults';
import { MazeRequest } from 'src/app/worker/MazeRequest';
import { AckResponse } from 'src/app/worker/AckResponse';
import { nextTick } from 'vue';
import { SaveResponse } from 'src/app/worker/SaveResponse';
import { toBlob } from 'src/utils/blob';
import { SaveOptions } from 'src/app/file/SaveOptions';
import { SaveRequest } from 'src/app/worker/SaveRequest';
import { useSaveStore } from 'stores/saveStore';
import { PrintResponse } from 'src/app/worker/PrintResponse';
import { usePrintStore } from 'stores/printStore';
import printJS from 'print-js-updated';
import { PrintOptions } from 'src/app/file/PrintOptions';
import { PrintRequest } from 'src/app/worker/PrintRequest';

const UPDATE_PROCESSING_DELAY_MILLIS = 400; // Doherty Threshold
let updateProcessingTimeoutId: number | undefined;

const renderStore = useRenderStore();
const { url, processing } = storeToRefs(renderStore);

const saveStore = useSaveStore();
const { saving } = storeToRefs(saveStore);

const printStore = usePrintStore();
const { printing } = storeToRefs(printStore);

let mazeWidth = DEFAULT_MAZE_SIZE;
let mazeHeight = DEFAULT_MAZE_SIZE;
let loopFrac = DEFAULT_LOOP_PCT / 100;
let crossFrac = DEFAULT_CROSS_PCT / 100;
let longPassages = DEFAULT_LONG_PASSAGES;

let solution = DEFAULT_SOLUTION;
let roundedCorners = !DEFAULT_SQUARE_CORNERS;
let cellSize = DEFAULT_CELL_SIZE;
let imageWidth = DEFAULT_IMAGE_SIZE;
let imageHeight = DEFAULT_IMAGE_SIZE;
let lineWidthFrac = DEFAULT_LINE_WIDTH_PCT / 100;
let passageWidthFrac = DEFAULT_PASSAGE_WIDTH_PCT / 100;
let wallColor = toColor(DEFAULT_WALL_COLOR);
let solutionColor = toColor(DEFAULT_SOLUTION_COLOR);
let backgroundColor = toColor(DEFAULT_BACKGROUND_COLOR);

let maskBlobUrl: string | undefined = undefined;

let idSequence = 0;
const activeIds = new Set<number>();

let lastPrintUrl: string | null = null;

const worker = new MazeWorker();
worker.onmessage = <T>(event: MessageEvent<Message<T>>) => {
    const message = event.data;
    switch (message.type) {
        case MessageType.MAZE_RESPONSE:
            onMazeResponse(message.data as MazeResponse);
            break;
        case MessageType.SAVE_RESPONSE:
            void onSaveResponse(message.data as SaveResponse);
            break;
        case MessageType.PRINT_RESPONSE:
            void onPrintResponse(message.data as PrintResponse);
            break;
        case MessageType.ACK_RESPONSE:
            onAckResponse((message.data as AckResponse).id);
            break;
    }
};

function updateProcessing(delayed = false) {
    const newValue = activeIds.size !== 0;
    if (newValue) {
        if (!processing.value) {
            if (delayed) {
                processing.value = true;
            } else {
                clearTimeout(updateProcessingTimeoutId);
                updateProcessingTimeoutId = window.setTimeout(() => updateProcessing(true),
                        UPDATE_PROCESSING_DELAY_MILLIS);
            }
        }
    } else if (processing.value) {
        processing.value = false;
    }
}

function onAckResponse(id: number) {
    activeIds.delete(id);
    updateProcessing();
}

async function onPrintResponse(response: PrintResponse) {
    try {
        printJS({
            printable: response.url,
            type: 'pdf',
            showModal: true,
        });
    } finally {
        printing.value = false;
        if (lastPrintUrl) {
            URL.revokeObjectURL(lastPrintUrl);
        }
        lastPrintUrl = response.url;
    }
}

async function onSaveResponse(response: SaveResponse) {
    try {
        saveAs(await toBlob(response.url), response.filename);
    } finally {
        saving.value = false;
        URL.revokeObjectURL(response.url);
    }
}

function onMazeResponse(response: MazeResponse) {
    onAckResponse(response.id);
    void nextTick(() => {
        if (url.value) {
            URL.revokeObjectURL(url.value);
        }
        url.value = response.url;
    });
}

export function onPrint(printOptions: PrintOptions) {
    printing.value = true;
    worker.postMessage(new Message(MessageType.PRINT_REQUEST, new PrintRequest(
            new RenderOptions(solution, roundedCorners, cellSize, imageWidth, imageHeight, lineWidthFrac,
                    passageWidthFrac, wallColor, solutionColor, backgroundColor),
            printOptions)));
}

export function onSave(saveOptions: SaveOptions) {
    saving.value = true;
    worker.postMessage(new Message(MessageType.SAVE_REQUEST, new SaveRequest(
            new RenderOptions(solution, roundedCorners, cellSize, imageWidth, imageHeight, lineWidthFrac,
                    passageWidthFrac, wallColor, solutionColor, backgroundColor),
            saveOptions)));
}

export function updateMaze(renderOnly: boolean) {
    const id = idSequence++;
    activeIds.add(id);
    updateProcessing();
    worker.postMessage(new Message(MessageType.MAZE_REQUEST, new MazeRequest(
            id,
            new MazeOptions(mazeWidth, mazeHeight, loopFrac, crossFrac, longPassages),
            new RenderOptions(solution, roundedCorners, cellSize, imageWidth, imageHeight, lineWidthFrac,
                    passageWidthFrac, wallColor, solutionColor, backgroundColor),
            renderOnly,
            maskBlobUrl)));
}

export function onMazeWidth(_mazeWidth: number) {
    mazeWidth = _mazeWidth;
    updateMaze(false);
}

export function onMazeHeight(_mazeHeight: number) {
    mazeHeight = _mazeHeight;
    updateMaze(false);
}

export function onLoopPct(loopPct: number) {
    loopFrac = loopPct / 100;
    updateMaze(false);
}

export function onCrossPct(crossPct: number) {
    crossFrac = crossPct / 100;
    updateMaze(false);
}

export function onLongPassages(_longPassages: boolean) {
    longPassages = _longPassages;
    updateMaze(false);
}

export function onSolution(_solution: boolean) {
    solution = _solution;
    updateMaze(true);
}

export function onSquareCorners(squareCorners: boolean) {
    roundedCorners = !squareCorners;
    updateMaze(true);
}

export function onCellAndImageSize(_cellSize: number, _imageWidth: number, _imageHeight: number) {
    cellSize = _cellSize;
    imageWidth = _imageWidth;
    imageHeight = _imageHeight;
    updateMaze(true);
}

export function onLineWidthPct(lineWidthPct: number) {
    lineWidthFrac = lineWidthPct / 100;
    updateMaze(true);
}

export function onPassageWidthPct(passageWidthPct: number) {
    passageWidthFrac = passageWidthPct / 100;
    updateMaze(true);
}

export function onWallColor(_wallColor: string) {
    wallColor = toColor(_wallColor);
    updateMaze(true);
}

export function onBackgroundColor(_backgroundColor: string) {
    backgroundColor = toColor(_backgroundColor);
    updateMaze(true);
}

export function onSolutionColor(_solutionColor: string) {
    solutionColor = toColor(_solutionColor);
    updateMaze(true);
}

export function onMask(_maskBlobUrl: string | undefined) {
    maskBlobUrl = _maskBlobUrl;
    updateMaze(false);
}