import { Cell } from './Cell';
import { Rgbas } from 'src/app/color/Rgbas';

function mergeRegions(cells: Cell[][], width: number, height: number, cell: Cell, c: Cell) {
    let sourceRegion: number;
    let targetRegion: number;
    if (cell.region > c.region) {
        sourceRegion = cell.region;
        targetRegion = c.region;
    } else {
        sourceRegion = c.region;
        targetRegion = cell.region;
    }
    for (let y = height - 1; y >= 0; --y) {
        for (let x = width - 1; x >= 0; --x) {
            const cell = cells[y][x];
            if (cell.region === sourceRegion) {
                cell.region = targetRegion;
            }
        }
    }

    while (cell.visitedBy && !cell.white) {
        cell.white = true;
        cell = cell.visitedBy;
    }
    while (c.visitedBy && !c.white) {
        c.white = true;
        c = c.visitedBy;
    }
}

function enqueue(cells: Cell[][], queue: Cell[], cell: Cell, x: number, y: number) {
    const c = cells[y][x];
    if (!(c.white || c.visitedBy)) {
        c.visitedBy = cell;
        c.region = cell.region;
        queue.push(c);
    }
}

function merge(cells: Cell[][], width: number, height: number, queue: Cell[], cell: Cell, x: number, y: number) {
    const c = cells[y][x];
    if (c.visitedBy || c.white) {
        if (c.region !== cell.region) {
            mergeRegions(cells, width, height, cell, c);
        }
    } else {
        c.visitedBy = cell;
        c.region = cell.region;
        queue.push(c);
    }
}

function joinRegions(cells: Cell[][], width: number, height: number) {
    const queue: Cell[] = [];
    for (let y = height - 1; y >= 0; --y) {
        for (let x = width - 1; x >= 0; --x) {
            const cell = cells[y][x];
            if (cell.white) {
                if (cell.y > 0) {
                    enqueue(cells, queue, cell, cell.x, cell.y - 1);
                }
                if (cell.x < width - 1) {
                    enqueue(cells, queue, cell, cell.x + 1, cell.y);
                }
                if (cell.y < height - 1) {
                    enqueue(cells, queue, cell, cell.x, cell.y + 1);
                }
                if (cell.x > 0) {
                    enqueue(cells, queue, cell, cell.x - 1, cell.y);
                }
            }
        }
    }

    while (true) {
        const cell = queue.shift();
        if (!cell) {
            break;
        }
        if (cell.y > 0) {
            merge(cells, width, height, queue, cell, cell.x, cell.y - 1);
        }
        if (cell.x < width - 1) {
            merge(cells, width, height, queue, cell, cell.x + 1, cell.y);
        }
        if (cell.y < height - 1) {
            merge(cells, width, height, queue, cell, cell.x, cell.y + 1);
        }
        if (cell.x > 0) {
            merge(cells, width, height, queue, cell, cell.x - 1, cell.y);
        }
    }
}

function pushRegion(cells: Cell[][], stack: Cell[], region: number, x: number, y: number) {
    const c = cells[y][x];
    if (c.white && c.region < 0) {
        c.region = region;
        stack.push(c);
    }
}

function fillRegion(cells: Cell[][], width: number, height: number, seed: Cell, region: number) {
    seed.region = region;
    const stack: Cell[] = [ seed ];
    while (true) {
        const cell = stack.pop();
        if (!cell) {
            break;
        }
        if (cell.y > 0) {
            pushRegion(cells, stack, region, cell.x, cell.y - 1);
        }
        if (cell.x < width - 1) {
            pushRegion(cells, stack, region, cell.x + 1, cell.y);
        }
        if (cell.y < height - 1) {
            pushRegion(cells, stack, region, cell.x, cell.y + 1);
        }
        if (cell.x > 0) {
            pushRegion(cells, stack, region, cell.x - 1, cell.y);
        }
    }
}

function findRegions(cells: Cell[][], width: number, height: number) {
    let region = 0;
    for (let y = height - 1; y >= 0; --y) {
        for (let x = width - 1; x >= 0; --x) {
            const cell = cells[y][x];
            if (cell.white && cell.region < 0) {
                fillRegion(cells, width, height, cell, region++);
            }
        }
    }
}

function createCells(data: Uint8ClampedArray, width: number, height: number): Cell[][] {
    const stride = 4 * width;
    const cells = new Array<Cell[]>(height);
    for (let y = height - 1; y >= 0; --y) {
        cells[y] = new Array<Cell>(width);
        const yOffset = stride * y;
        for (let x = width - 1; x >= 0; --x) {
            cells[y][x] = new Cell(x, y);
            const i = yOffset + 4 * x;
            cells[y][x].white = data[i + 3] >= 128 && .299 * data[i] + .587 * data[i + 1] + .114 * data[i + 2] >= 128;
        }
    }
    return cells;
}

function createMask(cells: Cell[][], width: number, height: number): boolean[][] {
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (let y = height - 1; y >= 0; --y) {
        for (let x = width - 1; x >= 0; --x) {
            if (cells[y][x].white) {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        }
    }
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const mask = new Array<boolean[]>(h);
    for (let y = h - 1; y >= 0; --y) {
        mask[y] = new Array<boolean>(w);
        for (let x = w - 1; x >= 0; --x) {
            mask[y][x] = cells[minY + y][minX + x].white;
        }
    }
    return mask;
}

export function loadMask(rgbas: Rgbas): boolean[][] {
    const { data, width, height } = rgbas;
    const cells = createCells(data, width, height);
    findRegions(cells, width, height);
    joinRegions(cells, width, height);
    return createMask(cells, width, height);
}