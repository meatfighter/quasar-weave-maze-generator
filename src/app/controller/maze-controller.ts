import MazeWorker from 'src/app/worker/worker?worker';
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
} from 'stores/optionsStore';
import { MessageType } from 'src/app/worker/MessageType';
import { Message } from 'src/app/worker/Message';
import { GenerateMazeTask } from 'src/app/maze/GenerateMazeTask';
import { MazeOptions } from 'src/app/maze/MazeOptions';
import { Maze } from 'src/app/maze/Maze';
import { MazeResponse } from 'src/app/maze/MazeResponse';
import { toColor } from 'src/app/color/Color';
import { RenderResponse } from 'src/app/render/RenderResponse';
import { RenderMazeTask } from 'src/app/render/RenderMazeTask';
import { RenderOptions } from 'src/app/render/RenderOptions';

let taskSequence = 0;

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

let runningMazeTaskId: string | null = null;
let runningRenderTaskId: string | null = null;

let maze = new Maze(new MazeOptions(mazeWidth, mazeHeight, loopFrac, crossFrac, longPassages));

const worker = new MazeWorker();
onmessage = <T>(event: MessageEvent<Message<T>>) => {
    const message = event.data;
    switch (message.type) {
        case MessageType.MAZE:
            onMaze(message.data as MazeResponse);
            break;
        case MessageType.RENDER:
            onRender(message.data as RenderResponse);
            break;
    }
};

function onMaze(response: MazeResponse) {
    if (response.id !== runningMazeTaskId) {
        return;
    }
    maze = response.maze;
}

function onRender(response: RenderResponse) {
    if (response.id !== runningRenderTaskId) {
        return;
    }
}

function updateMaze() {
    if (runningMazeTaskId) {
        worker.postMessage(new Message(MessageType.CANCEL, runningMazeTaskId));
        runningMazeTaskId = null;
    }
    runningMazeTaskId = taskSequence.toString();
    ++taskSequence;
    worker.postMessage(new Message(MessageType.GENERATE_MAZE, new GenerateMazeTask(runningMazeTaskId,
            new MazeOptions(mazeWidth, mazeHeight, loopFrac, crossFrac, longPassages))));
}

function updateRender() {
    if (runningMazeTaskId) {
        return;
    }
    if (runningRenderTaskId) {
        worker.postMessage(new Message(MessageType.CANCEL, runningRenderTaskId));
        runningRenderTaskId = null;
    }
    runningRenderTaskId = taskSequence.toString();
    ++taskSequence;
    worker.postMessage(new Message(MessageType.RENDER_MAZE, new RenderMazeTask(runningRenderTaskId, maze,
            new RenderOptions(solution, roundedCorners, cellSize, imageWidth, imageHeight, lineWidthFrac,
                    passageWidthFrac, wallColor, solutionColor, backgroundColor))));
}

export function onMazeWidth(_mazeWidth: number) {
    mazeWidth = _mazeWidth;
    updateMaze();
}

export function onMazeHeight(_mazeHeight: number) {
    mazeHeight = _mazeHeight;
    updateMaze();
}

export function onLoopPct(loopPct: number) {
    loopFrac = loopPct / 100;
    updateMaze();
}

export function onCrossPct(crossPct: number) {
    crossFrac = crossPct / 100;
    updateMaze();
}

export function onLongPassages(_longPassages: boolean) {
    longPassages = _longPassages;
    updateMaze();
}

export function onSolution(_solution: boolean) {
    solution = _solution;
    updateRender();
}

export function onSquareCorners(squareCorners: boolean) {
    roundedCorners = !squareCorners;
    updateRender();
}

export function onCellSize(_cellSize: number) {
    cellSize = _cellSize;
    updateRender();
}

export function onImageWidth(_imageWidth: number) {
    imageWidth = _imageWidth;
    updateRender();
}

export function onImageHeight(_imageHeight: number) {
    imageHeight = _imageHeight;
    updateRender();
}

export function onLineWidthPct(lineWidthPct: number) {
    lineWidthFrac = lineWidthPct / 100;
    updateRender();
}

export function onPassageWidthPct(passageWidthPct: number) {
    passageWidthFrac = passageWidthPct / 100;
    updateRender();
}

export function onWallColor(_wallColor: string) {
    wallColor = toColor(_wallColor);
    updateRender();
}

export function onBackgroundColor(_backgroundColor: string) {
    backgroundColor = toColor(_backgroundColor);
    updateRender();
}

export function onSolutionColor(_solutionColor: string) {
    solutionColor = toColor(_solutionColor);
    updateRender();
}