export class MazeOptions {
    constructor(public readonly width: number,
                public readonly height: number,
                public readonly loopFrac: number,
                public readonly crossFrac: number,
                public readonly longPassages: boolean) {
    }
}