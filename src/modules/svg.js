/** @module svg */

/**
 * async function that fetches svg image from assets
 * @param {string} imgName - name of image file
 */
async function getSVGInline(imgName) {
    return fetch(`assets/${imgName}.svg`).then((response) => response.text());
}

/**
 * async function that fetches svg image from assets and inlines it into document
 * @param {string} imgName - name of image file
 * @param {string} containerId - id of html element inside which image is inlined into
 */
async function putSVGInline(imgName, containerId) {
    getSVGInline(imgName).then((img) => {
        const container = document.getElementById(containerId);
        container.innerHTML = img;
    });
}

export { putSVGInline };
