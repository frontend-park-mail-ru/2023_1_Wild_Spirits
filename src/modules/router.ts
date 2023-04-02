import { Component } from "components/Component";

type RouterType = Record<string, () => Component>;

class Router {
    #locationParts: string[] = [];
    #searchParams: URLSearchParams | undefined;

    constructor() {
        this.#parseLocation();
    }

    reset() {
        this.#parseLocation();
    }

    switch(routes: RouterType) {
        for (const url in routes) {
            if (this.#locationParts.at(0) === url) {
                this.#locationParts = this.#locationParts.slice(1);
                return routes[url]().render();
            }
        }
        return "";
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
