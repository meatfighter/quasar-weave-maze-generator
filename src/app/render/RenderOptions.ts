import { Color } from 'src/app/color/Color';

export class RenderOptions {
    constructor(public readonly solution: boolean,
                public readonly roundedCorners: boolean,
                public readonly cellSize: number,
                public readonly imageWidth: number,
                public readonly imageHeight: number,
                public readonly lineWidthFrac: number,
                public readonly passageWidthFrac: number,
                public readonly wallColor: Color,
                public readonly solutionColor: Color,
                public readonly backgroundColor: Color) {
    }
}