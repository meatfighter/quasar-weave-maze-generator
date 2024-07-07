import { Rgbas } from 'src/app/color/Rgbas';

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
        return await loadRgbas(blobUrl, displayName);
    } catch (e: unknown) {
        throw e;
    } finally {
        URL.revokeObjectURL(blobUrl);
    }
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