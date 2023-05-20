export const toWebP = (imageUrl: string, callback: (imageBlob: Blob) => void) => {
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext("2d");

        if (context !== null) {
            context.drawImage(image, 0, 0);

            canvas.toBlob((blob) => {
                if (blob !== null) {
                    callback(blob);
                }
            }, "image/webp");
        }
    };
};
