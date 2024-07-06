import { MazeOptions } from 'src/app/maze/MazeOptions';
import { RenderOptions } from 'src/app/render/RenderOptions';

export class MazeRequest {
    constructor(public readonly id: number,
                public readonly mazeOptions: MazeOptions,
                public readonly renderOptions: RenderOptions,
                public readonly renderOnly: boolean) {
    }
}