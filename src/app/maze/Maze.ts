import { Cell } from './Cell';
import { MazeOptions } from './MazeOptions';

export class Maze {
    width: number;
    height: number;
    cells: Cell[][];

    constructor(options: MazeOptions, mask?: boolean[][]) {
        if (mask) {
            this.width = mask[0].length;
            this.height = mask.length;
        } else {
            this.width = options.width;
            this.height = options.height;
        }
        this.cells = new Array<Cell[]>(this.height);
        for (let i = this.height - 1; i >= 0; --i) {
            this.cells[i] = new Array<Cell>(this.width);
            for (let j = this.width - 1; j >= 0; --j) {
                this.cells[i][j] = new Cell(j, i, mask ? mask[i][j] : true);
            }
        }
    }
}