export enum FileFormat {
    PNG,
    SVG,
    PDF,
    ALL_FORMATS,
}

export function toFileFormat(format: string | undefined): FileFormat {
    if (!format) {
        return DEFAULT_FILE_FORMAT;
    }
    switch (format.trim().toLowerCase()) {
        case 'png':
            return FileFormat.PNG;
        case 'svg':
            return FileFormat.SVG;
        case 'pdf':
            return FileFormat.PDF;
        default:
            throw new Error('\nFile format must be either png, svg, or pdf.\n');
    }
}

export function toFileExtensions(format: FileFormat): string[] {
    switch (format) {
        case FileFormat.PNG:
            return [ 'png' ];
        case FileFormat.SVG:
            return [ 'svg' ];
        case FileFormat.PDF:
            return [ 'pdf' ];
        default:
            return [ 'png', 'svg', 'pdf' ];
    }
}

export const DEFAULT_FILE_FORMAT = FileFormat.ALL_FORMATS;