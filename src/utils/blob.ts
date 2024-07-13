export function toBlobUrl(array: Uint8ClampedArray) {
    return URL.createObjectURL(new Blob([ array ], { type: 'application/octet-stream' }));
}

export async function toUint8ClampedArray(blobUrl: string): Promise<Uint8ClampedArray> {
    return new Uint8ClampedArray(await (await toBlob(blobUrl)).arrayBuffer());
}

export async function toBlob(blobUrl: string): Promise<Blob> {
    return (await fetch(blobUrl)).blob();
}