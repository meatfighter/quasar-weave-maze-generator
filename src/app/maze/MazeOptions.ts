export const MIN_MAZE_SIZE = 1;
export const MAX_MAZE_SIZE = 200;
export const DEFAULT_MAZE_SIZE = 30;

export const MIN_LOOP_FRAC = 0;
export const MAX_LOOP_FRAC = 1;
export const DEFAULT_LOOP_FRAC = .05;

export const MIN_CROSS_FRAC = 0;
export const MAX_CROSS_FRAC = 1;
export const DEFAULT_CROSS_FRAC = .25;

export const DEFAULT_LONG_PASSAGES = false;

export class MazeOptions {
    constructor(public readonly width = DEFAULT_MAZE_SIZE,
                public readonly height = DEFAULT_MAZE_SIZE,
                public readonly loopFrac = DEFAULT_LOOP_FRAC,
                public readonly crossFrac = DEFAULT_CROSS_FRAC,
                public readonly longPassages = DEFAULT_LONG_PASSAGES,

                public readonly mask?: boolean[][]) {
    }
}