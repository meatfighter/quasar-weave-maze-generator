import { Point } from './Point';
import { Segment } from './Segment';

export class Line implements Segment {

    private horizontal: boolean;

    constructor(public p0: Point, public p1: Point) {
        this.horizontal = p0.compareY(p1);
    }

    isLine(): boolean {
        return true;
    }

    getStart(): Point {
        return this.p0;
    }

    getEnd(): Point {
        return this.p1;
    }

    getLeft(): Segment | null {
        return null;
    }

    getRight(): Segment | null {
        return null;
    }

    reverse() {
        const t = this.p0;
        this.p0 = this.p1;
        this.p1 = t;
    }

    merge(line: Line): boolean {
        if (this.horizontal === line.horizontal) {
            if (this.p1.equals(line.p0)) {
                this.p1 = line.p1;
            } else {
                this.p0 = line.p0;
            }
            return true;
        }
        return false;
    }

    toString(): string {
        return `${this.p0}-${this.p1}`;
    }
}