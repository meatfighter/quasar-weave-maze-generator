import { Message } from './Message';
import { MessageType } from 'src/app/worker/MessageType';
import { CancelState } from 'src/app/worker/CancelState';
import { generateMaze } from 'src/app/maze/maze-generator';
import { renderMaze } from 'src/app/render/maze-renderer';
import { MazeRequest } from 'src/app/worker/MazeRequest';
import { Maze } from 'src/app/maze/Maze';
import { RenderOptions } from 'src/app/render/RenderOptions';
import { MazeResponse } from 'src/app/worker/MazeResponse';
import { DeactivatedResponse } from 'src/app/worker/DeactivatedResponse';

let currentCancelState: CancelState | null = null;
let generatingMaze = false;
let maze: Maze | null = null;
let currentRenderOptions: RenderOptions | null = null;

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
        self.postMessage(new Message(MessageType.DEACTIVATED_RESPONSE, new DeactivatedResponse(request.id)));
        return;
    }
    currentRenderOptions = null;

    if (currentCancelState) {
        currentCancelState.cancelled = true;
    }
    currentCancelState = new CancelState();

    if (request.renderOnly && maze) {
        void drawMaze(request.id, maze, request.renderOptions, currentCancelState);
        return;
    }

    generatingMaze = true;
    maze = null;
    void generateAndRenderMaze(request, currentCancelState);
}

async function generateAndRenderMaze(request: MazeRequest, cancelState: CancelState) {
    const _maze = await generateMaze(request.mazeOptions, cancelState);
    if (!_maze || cancelState.cancelled) {
        self.postMessage(new Message(MessageType.DEACTIVATED_RESPONSE, new DeactivatedResponse(request.id)));
        return;
    }
    maze = _maze;
    generatingMaze = false;

    const renderingOptions = currentRenderOptions || request.renderOptions;
    currentRenderOptions = null;
    await drawMaze(request.id, _maze, renderingOptions, cancelState);
}

async function drawMaze(id: number, maze: Maze, renderOptions: RenderOptions, cancelState: CancelState) {
    const blob = await renderMaze(maze, renderOptions, cancelState);
    if (!blob || cancelState.cancelled) {
        self.postMessage(new Message(MessageType.DEACTIVATED_RESPONSE, new DeactivatedResponse(id)));
        return;
    }
    currentCancelState = null;

    self.postMessage(new Message(MessageType.MAZE_RESPONSE, new MazeResponse(id, URL.createObjectURL(blob))));
}

export {}