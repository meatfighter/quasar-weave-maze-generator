import { Maze } from './Maze';
import { Cell } from './Cell';
import { Node } from './Node';
import { permutations, shuffleArray } from 'src/utils/arrays';
import { isCancelled, Task } from 'src/app/worker/Task';

function findBorderNodes(maze: Maze): Set<Node> {
    const cells = maze.cells;
    const set = new Set<Cell>();
    for (let x = maze.width - 1; x >= 0; --x) {
        for (let y = 0; y < maze.height; ++y) {
            if (cells[y][x].white) {
                set.add(cells[y][x]);
                break;
            }
        }
        for (let y = maze.height - 1; y >= 0; --y) {
            if (cells[y][x].white) {
                set.add(cells[y][x]);
                break;
            }
        }
    }
    for (let y = maze.height - 1; y >= 0; --y) {
        for (let x = 0; x < maze.width; ++x) {
            if (cells[y][x].white) {
                set.add(cells[y][x]);
                break;
            }
        }
        for (let x = maze.width - 1; x >= 0; --x) {
            if (cells[y][x].white) {
                set.add(cells[y][x]);
                break;
            }
        }
    }
    const borderCells = Array.from(set);
    shuffleArray(borderCells);
    const borderNodes = new Set<Node>();
    borderCells.forEach(cell => borderNodes.add(cell.lower));
    return borderNodes;
}

function flood(seed: Node, maze: Maze, borderNodes: Set<Node>, bestSolution: Node[], stack: Node[]) {
    const cells = maze.cells;
    for (let y = maze.height - 1; y >= 0; --y) {
        for (let x = maze.width - 1; x >= 0; --x) {
            const cell = cells[y][x];
            const { lower, upper } = cell;
            lower.visitedBy = null;
            upper.visitedBy = null;
        }
    }
    seed.visitedBy = seed;
    seed.region = 0;
    stack.push(seed);
    while (true) {
        const node = stack.pop();
        if (!node) {
            break;
        }
        if (borderNodes.has(node) && node.region > bestSolution.length) {
            bestSolution.length = 0;
            let n = node;
            while (true) {
                bestSolution.push(n);
                if (!n.visitedBy || n.visitedBy === n) {
                    break;
                }
                n = n.visitedBy;
            }
        }
        const nextLength = node.region + 1;
        if (node.north && !node.north.visitedBy) {
            node.north.visitedBy = node;
            node.north.region = nextLength;
            stack.push(node.north);
        }
        if (node.east && !node.east.visitedBy) {
            node.east.visitedBy = node;
            node.east.region = nextLength;
            stack.push(node.east);
        }
        if (node.south && !node.south.visitedBy) {
            node.south.visitedBy = node;
            node.south.region = nextLength;
            stack.push(node.south);
        }
        if (node.west && !node.west.visitedBy) {
            node.west.visitedBy = node;
            node.west.region = nextLength;
            stack.push(node.west);
        }
    }
}

function wireTerminal(maze: Maze, node: Node) {
    const cells = maze.cells;
    const cell = node.cell;
    const permutation = permutations[Math.floor(permutations.length * Math.random())];
    for (let i = permutation.length - 1; i >= 0; --i) {
        switch (permutation[i]) {
            case 0: {
                const y = cell.y - 1;
                if (y < 0 || !cells[y][cell.x].white) {
                    node.north = node.north2 = node;
                    return;
                }
                break;
            }
            case 1: {
                const x = cell.x + 1;
                if (x >= maze.width || !cells[cell.y][x].white) {
                    node.east = node.east2 = node;
                    return;
                }
                break;
            }
            case 2: {
                const y = cell.y + 1;
                if (y >= maze.height || !cells[y][cell.x].white) {
                    node.south = node.south2 = node;
                    return;
                }
                break;
            }
            default: {
                const x = cell.x - 1;
                if (x < 0 || !cells[cell.y][x].white) {
                    node.west = node.west2 = node;
                    return;
                }
                break;
            }
        }
    }
}

function wireSolution(solution: Node[], maze: Maze) {
    const cells = maze.cells;
    for (let y = maze.height - 1; y >= 0; --y) {
        for (let x = maze.width - 1; x >= 0; --x) {
            const cell = cells[y][x];
            const { lower, upper } = cell;
            lower.north2 = lower.east2 = lower.south2 = lower.west2 = null;
            upper.north2 = upper.east2 = upper.south2 = upper.west2 = null;
        }
    }
    wireTerminal(maze, solution[0]);
    wireTerminal(maze, solution[solution.length - 1]);
    for (let i = solution.length - 2; i >= 0; --i) {
        const n0 = solution[i];
        const n1 = solution[i + 1];
        if (n0.north === n1) {
            n0.north2 = n1;
            n1.south2 = n0;
        } else if (n0.east === n1) {
            n0.east2 = n1;
            n1.west2 = n0;
        } else if (n0.south === n1) {
            n0.south2 = n1;
            n1.north2 = n0;
        } else if (n0.west === n1) {
            n0.west2 = n1;
            n1.east2 = n0;
        }
    }
}

export async function solveMaze(maze: Maze, task: Task) {
    const borderNodes = findBorderNodes(maze);
    const bestSolution: Node[] = [];
    const stack: Node[] = [];
    for (const node of borderNodes) {
        if (await isCancelled(task)) {
            return;
        }
        flood(node, maze, borderNodes, bestSolution, stack);
    }
    wireSolution(bestSolution, maze);
}