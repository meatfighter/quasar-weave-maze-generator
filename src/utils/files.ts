const INVALID_FILENAME_CHARS = /[\\/:*?"<>|]/;
const MAX_FILENAME_LENGTH = 128;

export function validateFilename(filename: string): boolean {
    filename = filename.trim();
    return filename.length > 0 && filename.length <= MAX_FILENAME_LENGTH && !INVALID_FILENAME_CHARS.test(filename);
}