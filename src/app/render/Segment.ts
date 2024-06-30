import { Point } from './Point';

export interface Segment {
    getStart(): Point;
    getEnd(): Point;
    getLeft(): Segment | null;
    getRight(): Segment | null;
    reverse(): void;
    isLine(): boolean;
}