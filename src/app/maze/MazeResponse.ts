import { Maze } from 'src/app/maze/Maze';

export class MazeResponse {
    constructor(public readonly id: string,
                public readonly maze: Maze) {
    }
}