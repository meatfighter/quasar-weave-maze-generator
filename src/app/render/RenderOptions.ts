import { Color } from 'src/app/color/Color';
// import { DEFAULT_PAPER_SIZE } from './PaperSize';
// import { DEFAULT_FILE_FORMAT } from './FileFormat';

// export const DEFAULT_FILENAME_PREFIX = 'maze';

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
                public readonly backgroundColor: Color,

                // public readonly outputDirectory: string,
                // public readonly paperSize = DEFAULT_PAPER_SIZE, // only applicable to PDF
                // public readonly fileFormat = DEFAULT_FILE_FORMAT,
                // public readonly filenamePrefix = DEFAULT_FILENAME_PREFIX,
                // public readonly timestamp = DEFAULT_TIMESTAMP,
                ) {
    }
}