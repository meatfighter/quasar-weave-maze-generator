import { RenderOptions } from 'src/app/render/RenderOptions';
import { ITERATIONS_PER_YIELD, Task } from 'src/app/worker/Task';
import { Maze } from 'src/app/maze/Maze';

export class RenderMazeTask implements Task {

    cancelled = false;
    yieldCounter = ITERATIONS_PER_YIELD;

    constructor(public readonly id: string,
                public readonly maze: Maze,
                public readonly options: RenderOptions) {
    }
}