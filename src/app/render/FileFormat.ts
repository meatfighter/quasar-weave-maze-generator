export enum FileFormat {
    PNG,
    SVG,
    PDF,
}

export function toFileExtension(format: FileFormat): string {
    switch (format) {
        case FileFormat.PNG:
            return 'png';
        case FileFormat.SVG:
            return 'svg';
        default:
            return 'pdf';
    }
}