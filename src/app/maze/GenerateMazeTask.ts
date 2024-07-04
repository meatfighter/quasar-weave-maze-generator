import { MazeOptions } from 'src/app/maze/MazeOptions';
import { ITERATIONS_PER_YIELD, Task } from 'src/app/worker/Task';

export class GenerateMazeTask implements Task {

    cancelled = false;
    yieldCounter = ITERATIONS_PER_YIELD;

    constructor(public readonly id: string,
                public readonly options: MazeOptions) {
    }
}