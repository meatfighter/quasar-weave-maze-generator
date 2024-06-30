import { Segment } from './Segment';
import { Point } from './Point';

export class PathNode implements Segment {

    constructor(public s0: Segment, public s1: Segment) {
    }

    getStart(): Point {
        return this.s0.getStart();
    }

    getEnd(): Point {
        return this.s1.getEnd();
    }

    getLeft(): Segment | null {
        return this.s0;
    }

    getRight(): Segment | null {
        return this.s1;
    }

    reverse() {
        this.s0.reverse();
        this.s1.reverse();

        const t = this.s0;
        this.s0 = this.s1;
        this.s1 = t;
    }

    isLine(): boolean {
        return false;
    }

    toString(): string {
        return `${this.s0}, ${this.s1}`;
    }
}