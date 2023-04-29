/** @module svg */

import { LoadStatus } from "requests/LoadStatus";

type resolverT = (value: string | PromiseLike<string>) => void;
type rejectT = (reason?: any) => void;

class SVGLoader {
    images: {[key: string]: {status: LoadStatus.Type, data: string | undefined}}
    subscribers: {[key: string]: {resolve: resolverT, reject: rejectT}[]}
    constructor() {
        this.images = {}
        this.subscribers = {}
    }

    async addImage(url: string): Promise<string> {
        this.images[url] = {status: LoadStatus.LOADING, data: undefined};
        const response = await fetch(url)
        const data = await response.text();
        this.images[url].data = data
        this.images[url].status = LoadStatus.DONE;

        this.subscribers[url].forEach(({resolve, reject}) => resolve(data));
        return data;
    }

    async getImage(url: string): Promise<string> {
        if (this.images[url] === undefined) {
            return this.addImage(url);
        }

        if (this.images[url].status === LoadStatus.LOADING) {
            return new Promise<string>((resolve, reject) => {
                if (this.subscribers[url]) {
                    this.subscribers[url].push({resolve, reject});
                } else {
                    this.subscribers[url] = [{resolve, reject}];
                }
            })
        }

        return this.images[url].data!;
    }
}

let svgLoader = new SVGLoader();

export {svgLoader};
