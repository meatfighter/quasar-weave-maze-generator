import { Point } from './Point';
import { Segment } from './Segment';

export class Arc implements Segment {

    constructor(public p0: Point, public p1: Point, public p2: Point, public radius: number) {
    }

    isLine(): boolean {
        return false;
    }

    getStart(): Point {
        return this.p0;
    }

    getEnd(): Point {
        return this.p2;
    }

    getLeft(): Segment | null {
        return null;
    }

    getRight(): Segment | null {
        return null;
    }

    reverse() {
        const t = this.p0;
        this.p0 = this.p2;
        this.p2 = t;
    }

    toString(): string {
        return `${this.p0}~${this.p1}~${this.p2}:${this.radius}`;
    }
}