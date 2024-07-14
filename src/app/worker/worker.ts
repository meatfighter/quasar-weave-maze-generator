import JSZip from 'jszip';
import { Message } from './Message';
import { MessageType } from 'src/app/worker/MessageType';
import { CancelState } from 'src/app/worker/CancelState';
import { generateMaze } from 'src/app/maze/maze-generator';
import { getPaths, renderMaze } from 'src/app/render/maze-renderer';
import { MazeRequest } from 'src/app/worker/MazeRequest';
import { Maze } from 'src/app/maze/Maze';
import { RenderOptions } from 'src/app/render/RenderOptions';
import { MazeResponse } from 'src/app/worker/MazeResponse';
import { AckResponse } from 'src/app/worker/AckResponse';
import { loadMask } from 'src/app/mask/mask-loader';
import { Rgbas } from 'src/app/color/Rgbas';
import { toUint8ClampedArray } from 'src/utils/blob';
import { SvgRenderer } from 'src/app/render/SvgRenderer';
import { SaveRequest } from 'src/app/worker/SaveRequest';
import { SaveResponse } from 'src/app/worker/SaveResponse';
import { Renderer } from 'src/app/render/Renderer';
import { FileFormat } from 'src/app/file/FileFormat';
import { PngRenderer } from 'src/app/render/PngRenderer';
import { getTimestamp } from 'src/utils/time';
import { toPaperSize } from 'src/app/file/PaperSize';
import { PdfRenderer } from 'src/app/render/PdfRenderer';

let currentCancelState: CancelState | null = null;
let maze: Maze | null = null;
let currentRenderOptions: RenderOptions | null = null;
let mask: boolean[][] | undefined = undefined;
let maskBlobUrl: string | null = null;
let saveRequest: SaveRequest | null = null;

self.onmessage = <T>(event: MessageEvent<Message<T>>) => {
    const message = event.data;
    switch (message.type) {
        case MessageType.MAZE_REQUEST:
            onMazeRequest(message.data as MazeRequest);
            break;
        case MessageType.SAVE_REQUEST:
            void onSaveRequest(message.data as SaveRequest);
            break;
    }
};

async function onSaveRequest(request: SaveRequest) {
    if (maze) {
        saveRequest = null;
    } else {
        saveRequest = request;
        return;
    }

    const { saveOptions, renderOptions } = request;
    const { wallPaths, solutionPaths } = getPaths(maze, renderOptions, saveOptions.solution);

    const paperSize = toPaperSize(saveOptions.paperSizeName);
    const suffix = `-${saveOptions.solutionSuffix}`;
    const timestamp = saveOptions.timestamp ? `-${getTimestamp()}` : '';
    const zip = new JSZip();
    for (const fileFormat of saveOptions.fileFormats) {
        for (let i = solutionPaths ? 1 : 0; i >= 0; --i) {
            const solution = (i === 1);

            let renderer: Renderer;
            switch (fileFormat) {
                case FileFormat.PNG:
                    renderer = new PngRenderer(false);
                    break;
                case FileFormat.SVG:
                    renderer = new SvgRenderer(true);
                    break;
                default:
                    renderer = new PdfRenderer(true);
                    break;
            }
            renderer.setSize(renderOptions.imageWidth, renderOptions.imageHeight, paperSize);

            zip.file(`${saveOptions.prefix}${solution ? suffix : ''}${timestamp}.${fileFormat}`,
                    await renderMaze(renderer, renderOptions, wallPaths, solution ? solutionPaths : undefined));
        }
    }

    self.postMessage(new Message(MessageType.SAVE_RESPONSE, new SaveResponse(`${saveOptions.prefix}${timestamp}.zip`,
            URL.createObjectURL(await zip.generateAsync({ type: 'blob' })))));
}

function onMazeRequest(request: MazeRequest) {
    if (request.renderOnly && currentCancelState) {
        currentRenderOptions = request.renderOptions;
        self.postMessage(new Message(MessageType.ACK_RESPONSE, new AckResponse(request.id)));
        return;
    }
    currentRenderOptions = null;

    if (request.renderOnly && maze) {
        void drawMaze(request.id, maze, request.renderOptions);
        return;
    }

    if (currentCancelState) {
        currentCancelState.cancelled = true;
    }
    currentCancelState = new CancelState();
    maze = null;
    void generateAndRenderMaze(currentCancelState, request);
}

function clearMask() {
    if (maskBlobUrl) {
        URL.revokeObjectURL(maskBlobUrl);
        maskBlobUrl = null;
    }
    mask = undefined;
}

async function generateAndRenderMaze(cancelState: CancelState, request: MazeRequest) {
    if (request.maskBlobUrl) {
        if (request.maskBlobUrl !== maskBlobUrl) {
            clearMask();
            try {
                mask = loadMask(new Rgbas(await toUint8ClampedArray(request.maskBlobUrl), request.mazeOptions.width,
                        request.mazeOptions.height));
                maskBlobUrl = request.maskBlobUrl;
            } catch {
            }
        }
    } else {
        clearMask();
    }

    const _maze = await generateMaze(cancelState, request.mazeOptions, mask);
    if (!_maze || cancelState.cancelled) {
        self.postMessage(new Message(MessageType.ACK_RESPONSE, new AckResponse(request.id)));
        return;
    }
    maze = _maze;
    currentCancelState = null;

    if (saveRequest) {
        await onSaveRequest(saveRequest);
    }

    const renderingOptions = currentRenderOptions || request.renderOptions;
    currentRenderOptions = null;
    await drawMaze(request.id, _maze, renderingOptions);
}

async function drawMaze(id: number, maze: Maze, renderOptions: RenderOptions) {

    const { wallPaths, solutionPaths } = getPaths(maze, renderOptions, renderOptions.solution);

    const renderer = new SvgRenderer(false);
    renderer.setSize(renderOptions.imageWidth, renderOptions.imageHeight);

    const blob = await renderMaze(renderer, renderOptions, wallPaths, solutionPaths);

    self.postMessage(new Message(MessageType.MAZE_RESPONSE, new MazeResponse(id, URL.createObjectURL(blob))));
}

export {}