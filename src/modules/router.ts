import { Component } from "components/Component";

type RouterType<T> = Record<string, () => T>;

interface SearchByUrlResult<T> {
    func: () => T;
    founded: boolean;
}

class Router {
    #locationParts: string[] = [];
    #searchParams: URLSearchParams | undefined;

    constructor() {
        this.#parseLocation();
    }

    reset() {
        this.#parseLocation();
    }

    #searchByUrl<T>(routes: RouterType<T>): { result: T; founded: true } | { result: undefined; founded: false } {
        for (const url in routes) {
            if (this.#locationParts.at(0) === url) {
                this.#locationParts = this.#locationParts.slice(1);
                return { result: routes[url](), founded: true };
            }
        }
        return { result: undefined, founded: false };
    }

    switchAny<T = any>(routes: RouterType<T>, defaultValue: () => T): T {
        const { result, founded } = this.#searchByUrl(routes);
        return founded ? result : defaultValue();
    }

    switchComponent(routes: RouterType<Component>): string {
        const { result, founded } = this.#searchByUrl(routes);
        return founded ? result.render() : "";
    }

    go(url: string) {
        history.pushState({}, "", url);
        this.#parseLocation();
    }

    getUrlParam(name: string): string | null {
        if (this.#searchParams) {
            return this.#searchParams.get(name);
        }
        return null;
    }

    #parseLocation() {
        const pathname = location.pathname.slice(1);
        this.#locationParts = pathname.split("/").map((value) => "/" + value);
        this.#searchParams = new URLSearchParams(location.search);
    }
}

export let router = new Router();

const getLinks = () => document.querySelectorAll(".js-router-link");

function linkEvent() {}

export const addRouterEvents = () => {
    console.log("addRouterEvents");
    // getLinks().forEach(link => {
    //     link.addEventListener("click")
    // })
};

export const removeRouterEvents = () => {
    console.log("removeRouterEvents");
};
