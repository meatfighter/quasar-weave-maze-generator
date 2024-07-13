// import * as path from 'path';
// import { promises as fs } from 'fs';
import { Maze } from 'src/app/maze/Maze';
import { PathOptimizer } from './PathOptimizer';
import { Segment } from './Segment';
import { Point } from './Point';
import { Line } from './Line';
import { Arc } from './Arc';
import { Renderer } from 'src/app/render/Renderer';
import { RenderOptions } from 'src/app/render/RenderOptions';
import { CancelState } from 'src/app/worker/CancelState';

const ITERATIONS_PER_YIELD = 256;
let yieldCounter = ITERATIONS_PER_YIELD;

function renderPaths(r: Renderer, paths: Segment[][], roundedCorners: boolean) {
    r.beginPath();
    paths.forEach(path => {
        let cursor = new Point();
        path.forEach(segment => {
            const p0 = segment.getStart();
            if (!p0.equals(cursor)) {
                r.moveTo(p0.x, p0.y);
            }
            if (segment.isLine()) {
                const line = segment as Line;
                r.lineTo(line.p1.x, line.p1.y);
                cursor = line.p1;
            } else {
                const arc = segment as Arc;
                if (roundedCorners) {
                    r.arcTo(arc.p1.x, arc.p1.y, arc.p2.x, arc.p2.y, arc.radius);
                } else {
                    r.lineTo(arc.p1.x, arc.p1.y);
                    r.lineTo(arc.p2.x, arc.p2.y);
                }
                cursor = arc.p2;
            }
        });
    });
    r.stroke();
}

export function generateSolutionPaths(maze: Maze, cellSize: number, cellMarginFrac: number): Segment[][] {

    const c = new PathOptimizer();

    const d0 = cellMarginFrac * cellSize;
    const d1 = (1 - cellMarginFrac) * cellSize;
    const dm = cellSize / 2;

    for (let i = maze.height - 1; i >= 0; --i) {
        const oy = i * cellSize;
        for (let j = maze.width - 1; j >= 0; --j) {
            const ox = j * cellSize;
            const cell = maze.cells[i][j];

            if (cell.upper.north2) {
                c.moveTo(ox + dm, oy);
                c.lineTo(ox + dm, oy + cellSize);
            } else if (cell.upper.east2) {
                c.moveTo(ox, oy + dm);
                c.lineTo(ox + cellSize, oy + dm);
            }

            if (cell.upper.north && cell.lower.east2) {
                c.moveTo(ox, oy + dm);
                c.lineTo(ox + d0, oy + dm);
                c.moveTo(ox + d1, oy + dm);
                c.lineTo(ox + cellSize, oy + dm);
            } else if (cell.upper.east && cell.lower.north2) {
                c.moveTo(ox + dm, oy);
                c.lineTo(ox + dm, oy + d0);
                c.moveTo(ox + dm, oy + d1);
                c.lineTo(ox + dm, oy + cellSize);
            } else {
                const lower = cell.lower;
                const value = (lower.north2 ? 0b1000 : 0) | (lower.east2 ? 0b0100 : 0) | (lower.south2 ? 0b0010 : 0)
                    | (lower.west2 ? 0b0001 : 0);

                switch (value) {
                    case 0b1100:
                        c.moveTo(ox + dm, oy);
                        c.arcTo(ox + dm, oy + dm, ox + cellSize, oy + dm, dm);
                        break;
                    case 0b0110:
                        c.moveTo(ox + cellSize, oy + dm);
                        c.arcTo(ox + dm, oy + dm, ox + dm, oy + cellSize, dm);
                        break;
                    case 0b0011:
                        c.moveTo(ox + dm, oy + cellSize);
                        c.arcTo(ox + dm, oy + dm, ox, oy + dm, dm);
                        break;
                    case 0b1001:
                        c.moveTo(ox, oy + dm);
                        c.arcTo(ox + dm, oy + dm, ox + dm, oy, dm);
                        break;

                    case 0b1010:
                        c.moveTo(ox + dm, oy);
                        c.lineTo(ox + dm, oy + cellSize);
                        break;
                    case 0b0101:
                        c.moveTo(ox, oy + dm);
                        c.lineTo(ox + cellSize, oy + dm);
                        break;
                }
            }
        }
    }

    return c.getPaths();
}

export function generateWallPaths(maze: Maze, cellSize: number, cellMarginFrac: number): Segment[][] {

    const c = new PathOptimizer();

    const d0 = cellMarginFrac * cellSize;
    const d1 = (1 - cellMarginFrac) * cellSize;
    const dm = cellSize / 2;
    const r0 = (d1 - d0) / 2;

    for (let i = maze.height - 1; i >= 0; --i) {
        const oy = i * cellSize;
        for (let j = maze.width - 1; j >= 0; --j) {
            const ox = j * cellSize;
            const cell = maze.cells[i][j];

            if (cell.upper.north) {
                c.moveTo(ox + d0, oy);
                c.lineTo(ox + d0, oy + cellSize);
                c.moveTo(ox + d1, oy);
                c.lineTo(ox + d1, oy + cellSize);
                c.moveTo(ox, oy + d0);
                c.lineTo(ox + d0, oy + d0);
                c.moveTo(ox, oy + d1);
                c.lineTo(ox + d0, oy + d1);
                c.moveTo(ox + d1, oy + d0);
                c.lineTo(ox + cellSize, oy + d0);
                c.moveTo(ox + d1, oy + d1);
                c.lineTo(ox + cellSize, oy + d1);
            } else if (cell.upper.east) {
                c.moveTo(ox, oy + d0);
                c.lineTo(ox + cellSize, oy + d0);
                c.moveTo(ox, oy + d1);
                c.lineTo(ox + cellSize, oy + d1);
                c.moveTo(ox + d0, oy);
                c.lineTo(ox + d0, oy + d0);
                c.moveTo(ox + d1, oy);
                c.lineTo(ox + d1, oy + d0);
                c.moveTo(ox + d0, oy + d1);
                c.lineTo(ox + d0, oy + cellSize);
                c.moveTo(ox + d1, oy + d1);
                c.lineTo(ox + d1, oy + cellSize);
            } else {
                const lower = cell.lower;
                const value = (lower.north ? 0b1000 : 0) | (lower.east ? 0b0100 : 0) | (lower.south ? 0b0010 : 0)
                    | (lower.west ? 0b0001 : 0);

                switch (value) {
                    case 0b1000:
                        c.moveTo(ox + d0, oy);
                        c.lineTo(ox + d0, oy + dm);
                        c.arcTo(ox + d0, oy + d1, ox + dm, oy + d1, r0);
                        c.arcTo(ox + d1, oy + d1, ox + d1, oy + dm, r0);
                        c.lineTo(ox + d1, oy);
                        break;
                    case 0b0100:
                        c.moveTo(ox + cellSize, oy + d0);
                        c.lineTo(ox + dm, oy + d0);
                        c.arcTo(ox + d0, oy + d0, ox + d0, oy + dm, r0);
                        c.arcTo(ox + d0, oy + d1, ox + dm, oy + d1, r0);
                        c.lineTo(ox + cellSize, oy + d1);
                        break;
                    case 0b0010:
                        c.moveTo(ox + d0, oy + cellSize);
                        c.lineTo(ox + d0, oy + dm);
                        c.arcTo(ox + d0, oy + d0, ox + dm, oy + d0, r0);
                        c.arcTo(ox + d1, oy + d0, ox + d1, oy + dm, r0);
                        c.lineTo(ox + d1, oy + cellSize);
                        break;
                    case 0b0001:
                        c.moveTo(ox, oy + d0);
                        c.lineTo(ox + dm, oy + d0);
                        c.arcTo(ox + d1, oy + d0, ox + d1, oy + dm, r0);
                        c.arcTo(ox + d1, oy + d1, ox + dm, oy + d1, r0);
                        c.lineTo(ox, oy + d1);
                        break;

                    case 0b1100:
                        c.moveTo(ox + d0, oy);
                        c.arcTo(ox + d0, oy + d1, ox + cellSize, oy + d1, d1);
                        c.moveTo(ox + d1, oy);
                        c.arcTo(ox + d1, oy + d0, ox + cellSize, oy + d0, d0);
                        break;
                    case 0b0110:
                        c.moveTo(ox + d0, oy + cellSize);
                        c.arcTo(ox + d0, oy + d0, ox + cellSize, oy + d0, d1);
                        c.moveTo(ox + d1, oy + cellSize);
                        c.arcTo(ox + d1, oy + d1, ox + cellSize, oy + d1, d0);
                        break;
                    case 0b0011:
                        c.moveTo(ox + d1, oy + cellSize);
                        c.arcTo(ox + d1, oy + d0, ox, oy + d0, d1);
                        c.moveTo(ox + d0, oy + cellSize);
                        c.arcTo(ox + d0, oy + d1, ox, oy + d1, d0);
                        break;
                    case 0b1001:
                        c.moveTo(ox + d1, oy);
                        c.arcTo(ox + d1, oy + d1, ox, oy + d1, d1);
                        c.moveTo(ox + d0, oy);
                        c.arcTo(ox + d0, oy + d0, ox, oy + d0, d0);
                        break;

                    case 0b1101:
                        c.moveTo(ox, oy + d1);
                        c.lineTo(ox + cellSize, oy + d1);
                        c.moveTo(ox + d1, oy);
                        c.arcTo(ox + d1, oy + d0, ox + cellSize, oy + d0, d0);
                        c.moveTo(ox + d0, oy);
                        c.arcTo(ox + d0, oy + d0, ox, oy + d0, d0);
                        break;
                    case 0b1110:
                        c.moveTo(ox + d0, oy);
                        c.lineTo(ox + d0, oy + cellSize);
                        c.moveTo(ox + d1, oy);
                        c.arcTo(ox + d1, oy + d0, ox + cellSize, oy + d0, d0);
                        c.moveTo(ox + d1, oy + cellSize);
                        c.arcTo(ox + d1, oy + d1, ox + cellSize, oy + d1, d0);
                        break;
                    case 0b0111:
                        c.moveTo(ox, oy + d0);
                        c.lineTo(ox + cellSize, oy + d0);
                        c.moveTo(ox + d1, oy + cellSize);
                        c.arcTo(ox + d1, oy + d1, ox + cellSize, oy + d1, d0);
                        c.moveTo(ox + d0, oy + cellSize);
                        c.arcTo(ox + d0, oy + d1, ox, oy + d1, d0);
                        break;
                    case 0b1011:
                        c.moveTo(ox + d1, oy);
                        c.lineTo(ox + d1, oy + cellSize);
                        c.moveTo(ox + d0, oy + cellSize);
                        c.arcTo(ox + d0, oy + d1, ox, oy + d1, d0);
                        c.moveTo(ox + d0, oy);
                        c.arcTo(ox + d0, oy + d0, ox, oy + d0, d0);
                        break;

                    case 0b1111:
                        c.moveTo(ox + d1, oy);
                        c.arcTo(ox + d1, oy + d0, ox + cellSize, oy + d0, d0);
                        c.moveTo(ox + d1, oy + cellSize);
                        c.arcTo(ox + d1, oy + d1, ox + cellSize, oy + d1, d0);
                        c.moveTo(ox + d0, oy + cellSize);
                        c.arcTo(ox + d0, oy + d1, ox, oy + d1, d0);
                        c.moveTo(ox + d0, oy);
                        c.arcTo(ox + d0, oy + d0, ox, oy + d0, d0);
                        break;

                    case 0b1010:
                        c.moveTo(ox + d0, oy);
                        c.lineTo(ox + d0, oy + cellSize);
                        c.moveTo(ox + d1, oy);
                        c.lineTo(ox + d1, oy + cellSize);
                        break;
                    case 0b0101:
                        c.moveTo(ox, oy + d0);
                        c.lineTo(ox + cellSize, oy + d0);
                        c.moveTo(ox, oy + d1);
                        c.lineTo(ox + cellSize, oy + d1);
                        break;
                }
            }
        }
    }

    return c.getPaths();
}

export async function getPaths(cancelState: CancelState, maze: Maze, options: RenderOptions, solution: boolean):
        Promise<{ wallPaths: Segment[][], solutionPaths?: Segment[][] }> {

    console.log(++yieldCounter + ' ' + cancelState); // TODO REMOVE, ALSO DO I NEED CANCEL STATE HERE?!!!

    const cellMarginFrac = (1 - options.passageWidthFrac) / 2;
    return {
        wallPaths: generateWallPaths(maze, options.cellSize, cellMarginFrac),
        solutionPaths: solution ? generateSolutionPaths(maze, options.cellSize, cellMarginFrac) : undefined,
    };
}

export async function renderMaze(cancelState: CancelState, renderer: Renderer, options: RenderOptions,
                                 wallPaths: Segment[][], solutionPaths?: Segment[][]): Promise<Blob | null> {

    console.log(++yieldCounter + ' ' + cancelState + ' ' + solutionPaths); // TODO REMOVE, ALSO DO I NEED CANCEL STATE HERE?!!!

    const linecap = options.roundedCorners ? 'round' : 'square';
    const lineWidth = options.lineWidthFrac * options.cellSize;

    const backgroundColor = options.backgroundColor;
    if (backgroundColor.alpha > 0) {
        renderer.setFill(backgroundColor).fillRect(0, 0, options.imageWidth, options.imageHeight);
    }

    if (solutionPaths && options.solutionColor.alpha > 0) {
        renderer.setStroke(linecap, lineWidth, options.solutionColor);
        renderPaths(renderer, solutionPaths, options.roundedCorners);
    }

    if (options.wallColor.alpha > 0) {
        renderer.setStroke(linecap, lineWidth, options.wallColor);
        renderPaths(renderer, wallPaths, options.roundedCorners);
    }

    return renderer.toBlob();
}