export function toBlobUrl(array: Uint8ClampedArray) {
    return URL.createObjectURL(new Blob([ array ], { type: 'application/octet-stream' }));
}

export async function toUint8ClampedArray(blobUrl: string): Promise<Uint8ClampedArray> {
    return new Uint8ClampedArray(await (await (await fetch(blobUrl)).blob()).arrayBuffer());
}