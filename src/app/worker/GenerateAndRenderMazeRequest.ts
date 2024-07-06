import { MazeOptions } from 'src/app/maze/MazeOptions';
import { RenderOptions } from 'src/app/render/RenderOptions';

export class GenerateAndRenderMazeRequest {
    constructor(public readonly mazeOptions: MazeOptions,
                public readonly renderOptions: RenderOptions) {
    }
}