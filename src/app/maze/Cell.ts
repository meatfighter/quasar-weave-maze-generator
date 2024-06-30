import { Node } from './Node';

export class Cell {
    readonly lower = new Node(this);
    readonly upper = new Node(this);

    constructor(public x: number, public y: number, public white: boolean) {
    }

    backup() {
        this.lower.backup();
        this.upper.backup();
    }

    restore() {
        this.lower.restore();
        this.upper.restore();
    }

    isFlat() {
        return !this.isNotFlat();
    }

    isNotFlat() {
        return this.upper.north || this.upper.east || this.upper.south || this.upper.west;
    }
}