import { Hashable } from '@/app/collections/Hashable';

const TOLERANCE = 1 / 256;

export class Point implements Hashable<Point> {

    readonly x: number;
    readonly y: number;

    private readonly hash: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.hash = Math.round(65537 * this.x) - Math.round(257 * this.y);
    }

    private compare(a: number, b: number): boolean {
        return Math.abs(a - b) <= TOLERANCE;
    }

    compareX(other: Point): boolean {
        return this.compare(this.x, other.x);
    }

    compareY(other: Point): boolean {
        return this.compare(this.y, other.y);
    }

    hashCode(): number {
        return this.hash;
    }

    equals(other: Point): boolean {
        return this === other || (this.compareX(other) && this.compareY(other));
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}