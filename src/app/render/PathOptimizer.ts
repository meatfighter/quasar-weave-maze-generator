import { Point } from './Point';
import { Line } from './Line';
import { Arc } from './Arc';
import { Segment } from './Segment';
import { HashMap } from '@/app/collections/HashMap';
import { PathNode } from './PathNode';

export class PathOptimizer {

    private cursor = new Point();
    private segments: Segment[] = [];

    moveTo(x: number, y: number) {
        this.cursor = new Point(x, y);
    }

    lineTo(x: number, y: number) {
        const p1 = new Point(x, y);
        this.segments.push(new Line(this.cursor, p1));
        this.cursor = p1;
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
        const p1 = new Point(x1, y1);
        const p2 = new Point(x2, y2);
        this.segments.push(new Arc(this.cursor, p1, p2, radius));
        this.cursor = p2;
    }

    private flatten(s: Segment | null, path: Segment[]) {
        if (!s) {
            return;
        }
        if (!(s.getLeft() || s.getRight())) {
            path.push(s);
            return;
        }
        if (s.getLeft()) {
            this.flatten(s.getLeft(), path);
        }
        if (s.getRight()) {
            this.flatten(s.getRight(), path);
        }
    }

    private optimize(path: Segment[]) {
        for (let i = path.length - 1; i > 0; --i) {
            if (path[i - 1].isLine() && path[i].isLine()) {
                const l0 = path[i - 1] as Line;
                const l1 = path[i] as Line;
                if (l0.merge(l1)) {
                    path.splice(i, 1);
                }
            }
        }
    }

    getPaths(): Segment[][] {
        const paths: Segment[][] = [];
        const map = new HashMap<Point, Segment>();
        this.segments.forEach(segment => {
            const startSegment = map.get(segment.getStart());
            if (startSegment) {
                map.delete(startSegment.getStart());
                map.delete(startSegment.getEnd());
                if (startSegment.getStart().equals(segment.getStart())) {
                    startSegment.reverse();
                }
                segment = new PathNode(startSegment, segment);
            }

            const endSegment = map.get(segment.getEnd());
            if (endSegment) {
                map.delete(endSegment.getStart());
                map.delete(endSegment.getEnd());
                if (endSegment.getEnd().equals(segment.getEnd())) {
                    endSegment.reverse();
                }
                segment = new PathNode(segment, endSegment);
            }

            map.set(segment.getStart(), segment);
            map.set(segment.getEnd(), segment);
        });
        map.values().forEach(segment => {
            if (!segment.getStart().equals(segment.getEnd())) {
                map.delete(segment.getEnd());
            }
        });
        map.values().forEach(segment => {
            const path: Segment[] = [];
            this.flatten(segment, path);
            this.optimize(path);
            paths.push(path);
        });

        this.cursor = new Point();
        this.segments = [];

        return paths;
    }
}