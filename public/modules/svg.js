async function getSVGInline(imgName) {
    return fetch(`assets/${imgName}.svg`).then((response)=>response.text());
}

async function waitForElement(elementId) {
    let el = document.getElementById(elementId);

    if (el != undefined)
        return el;

    let promise = new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutation)=>{
            console.log(mutation)
            let el = document.getElementById(elementId);
            console.log(el);
    
            if (el != undefined) {
                observer.disconnect();
                resolve(el);
            }
        });
        observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
    });

    return promise;
}

async function putSVGInline(imgName, containerId) {
    let container = waitForElement(containerId);

    const img = getSVGInline(imgName)

    let element = await container;
    img.then((img)=>{
        element.innerHTML = img;
    });
}

export {putSVGInline};
