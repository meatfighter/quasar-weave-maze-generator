import { Message } from './Message';
import { MessageType } from 'src/app/worker/MessageType';
import { CancelState } from 'src/app/worker/CancelState';
import { generateMaze } from 'src/app/maze/maze-generator';
import { renderMaze } from 'src/app/render/maze-renderer';
import { MazeRequest } from 'src/app/worker/MazeRequest';
import { Maze } from 'src/app/maze/Maze';
import { RenderOptions } from 'src/app/render/RenderOptions';
import { MazeResponse } from 'src/app/worker/MazeResponse';
import { AckResponse } from 'src/app/worker/AckResponse';
import { loadMask } from 'src/app/mask/mask-loader';
import { Rgbas } from 'src/app/color/Rgbas';
import { toUint8ClampedArray } from 'src/utils/blob';

let currentCancelState: CancelState | null = null;
let generatingMaze = false;
let maze: Maze | null = null;
let currentRenderOptions: RenderOptions | null = null;
let mask: boolean[][] | undefined = undefined;
let maskBlobUrl: string | null = null;

self.onmessage = <T>(event: MessageEvent<Message<T>>) => {
    const message = event.data;
    switch (message.type) {
        case MessageType.MAZE_REQUEST:
            onMazeRequest(message.data as MazeRequest);
            break;
    }
};

function onMazeRequest(request: MazeRequest) {
    if (request.renderOnly && generatingMaze) {
        currentRenderOptions = request.renderOptions;
        self.postMessage(new Message(MessageType.ACK_RESPONSE, new AckResponse(request.id)));
        return;
    }
    currentRenderOptions = null;

    if (currentCancelState) {
        currentCancelState.cancelled = true;
    }
    currentCancelState = new CancelState();

    if (request.renderOnly && maze) {
        void drawMaze(currentCancelState, request.id, maze, request.renderOptions);
        return;
    }

    generatingMaze = true;
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
    generatingMaze = false;

    const renderingOptions = currentRenderOptions || request.renderOptions;
    currentRenderOptions = null;
    await drawMaze(cancelState, request.id, _maze, renderingOptions);
}

async function drawMaze(cancelState: CancelState, id: number, maze: Maze, renderOptions: RenderOptions) {
    const blob = await renderMaze(cancelState, maze, renderOptions);
    if (!blob || cancelState.cancelled) {
        self.postMessage(new Message(MessageType.ACK_RESPONSE, new AckResponse(id)));
        return;
    }
    currentCancelState = null;

    self.postMessage(new Message(MessageType.MAZE_RESPONSE, new MazeResponse(id, URL.createObjectURL(blob))));
}

export {}