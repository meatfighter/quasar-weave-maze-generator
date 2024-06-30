export class Cell {

    white = false;
    region = -1;
    visitedBy: Cell | null = null;

    constructor(public x: number, public y: number) {
    }
}