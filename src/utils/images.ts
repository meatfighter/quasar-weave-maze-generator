import { Rgbas } from 'src/app/color/Rgbas';
import { MAX_MAZE_SIZE } from 'src/app/controller/defaults';

const DOWNLOAD_RETRIES = 3;
const DOWNLOAD_RETRY_DELAY_MILLIS = 500;

async function loadRgbas(src: string, displayName?: string): Promise<Rgbas> {
    return new Promise<Rgbas>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error(`Failed to get 2D image context${displayName ? ' for ' + displayName : '.'}`));
                return;
            }
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            resolve(new Rgbas(imageData.data, imageData.width, imageData.height));
        };
        img.onerror = () => reject(new Error(`Error loading image${displayName ? ' ' + displayName : '.'}`));
        img.src = src;
    });
}

async function makeRgbas(blobUrl: string, displayName?: string): Promise<Rgbas> {
    try {
        return validateRgbas(await loadRgbas(blobUrl, displayName));
    } finally {
        URL.revokeObjectURL(blobUrl);
    }
}

function validateRgbas(rgbas: Rgbas): Rgbas {
    console.log(`validate: ${rgbas.width} ${rgbas.height}`);
    if (rgbas.width === 0 || rgbas.height === 0) {
        throw new Error('The image must be at least 1\u00D71 pixels.');
    }
    if (rgbas.width > MAX_MAZE_SIZE || rgbas.height > MAX_MAZE_SIZE) {
        throw new Error(`The image cannot exceed ${MAX_MAZE_SIZE}\u00D7${MAX_MAZE_SIZE} pixels.`);
    }
    return rgbas;
}

export async function makeRgbasFromFile(file: File): Promise<Rgbas> {
    return makeRgbas(URL.createObjectURL(file), file.name);
}

export async function makeRgbasFromUrl(url: string) {
    for (let i = DOWNLOAD_RETRIES - 1; i >= 0; --i) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return makeRgbas(URL.createObjectURL(await response.blob()), url.split('/').pop() || url);
            }
        } catch {
        }
        if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, DOWNLOAD_RETRY_DELAY_MILLIS));
        }
    }
    throw new Error(`Error downloading ${url}`);
}