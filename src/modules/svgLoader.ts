/** @module svg */

class SVGLoader {
    images: {[key: string]: string}
    constructor() {
        this.images = {}
    }

    async addImage(url: string): Promise<string> {
        return fetch(url).then(response => 
            response.text().then(img => this.images[url] = img));
    }

    async getImage(url: string): Promise<string> {
        // if (this.images[url]) {
        //     return this.images[url];
        // }

        // return this.addImage(url);

        return fetch(url).then(response => 
            response.text());
    }
}

let svgLoader = new SVGLoader();

export {svgLoader};

// type HTMLCollectionGetter = ()=>HTMLCollection;
// interface SVGInlinerRule {
//     collectionGetter: HTMLCollectionGetter,
//     url: string
// }

// class SVGInliner {
//     loader: SVGLoader
//     rules: SVGInlinerRule[]

//     constructor(loader: SVGLoader, rules: SVGInlinerRule[]) {
//         this.loader = loader
//         this.rules = rules
//     }

//     async inlineSVG(containers: HTMLCollection, url: string) {
//         const svgImage = await this.loader.getImage(url);
//         for (const container of containers) {
//             container.innerHTML = svgImage;
//         }
//     }

//     async applyRules() {
//         for (const {collectionGetter, url} of this.rules) {
//             this.inlineSVG(collectionGetter(), url);
//         }
//     }
// }

// const classCollectionGetter = (className: string) => {
//     return ()=>document.getElementsByClassName(className)
// }

// const basicIconRule = (iconName: string) => ({
//     collectionGetter: classCollectionGetter(`${iconName}-icon-container`),
//     url: `/assets/img/${iconName}-icon.svg`
// });

// let loader = new SVGLoader();

// const inlinerRules = [
//     basicIconRule("comment"),
//     basicIconRule("heart"),
//     basicIconRule("invite"),
//     basicIconRule("bookmark"),
//     basicIconRule("edit"),
//     basicIconRule("tick-friend")
// ]

// let svgInliner = new SVGInliner(loader, inlinerRules)

// export { svgInliner };
