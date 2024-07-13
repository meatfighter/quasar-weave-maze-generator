import { FileFormat } from 'src/app/save/FileFormat';

export class SaveOptions {
    constructor(public solution: boolean,
                public timestamp: boolean,
                public prefix: string,
                public solutionSuffix: string,
                public fileFormats: Set<FileFormat>,
                public paperSizeName: string) {
    }
}

export const DEFAULT_PREFIX = 'maze';
export const DEFAULT_SOLUTION_SUFFIX = 'solution';