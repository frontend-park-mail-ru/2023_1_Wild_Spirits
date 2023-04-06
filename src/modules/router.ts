import { Component } from "components/Component";

type RouterType<T> = Record<string, () => T>;

interface SearchByUrlResult<T> {
    func: () => T;
    founded: boolean;
}

class Router {
    #locationParts: string[] = [];
    #searchParams: URLSearchParams | undefined;
    callbacks: (() => void)[] = [];

    constructor() {
        this.#parseLocation();

        window.addEventListener("popstate", this.#onPopState.bind(this));
    }

    subscribe(callback: () => void) {
        this.callbacks.push(callback);
    }

    #emit() {
        this.callbacks.forEach((callback) => callback());
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
        this.#emit();
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

    #onPopState() {
        console.log("#onPopState");
        this.#parseLocation();
        this.#emit();
    }
}

export let router = new Router();

const getLinks = () => document.querySelectorAll(".js-router-link");

function linkEvent(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLLinkElement;
    console.log("target.href:", target.href);
    router.go(target.href);
}

export const addRouterEvents = () => {
    console.log("addRouterEvents");
    getLinks().forEach((link) => {
        link.addEventListener("click", linkEvent);
    });
};

export const removeRouterEvents = () => {
    console.log("removeRouterEvents");
    getLinks().forEach((link) => {
        link.removeEventListener("click", linkEvent);
    });
};
