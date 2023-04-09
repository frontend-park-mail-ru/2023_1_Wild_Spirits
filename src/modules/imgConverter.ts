export const toWebP = (imageUrl: string, callback: (imageBlob: Blob) => void) => {
    let image = new Image()
    image.src = imageUrl;

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext('2d')!.drawImage(image, 0, 0);

    canvas.toBlob((blob) => {
        if (blob !== null) {
            callback(blob);
        }
    }, 'image/webp');
}