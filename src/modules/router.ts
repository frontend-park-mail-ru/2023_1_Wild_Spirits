type RouterType<T> = Record<string, () => T>;

class Router {
    #prevUrl: string;
    #nowUrl: string;
    #locationParts: string[] = [];
    #searchParams: URLSearchParams | undefined;
    callbacks: (() => void)[] = [];

    constructor() {
        this.#parseLocation();
        this.#prevUrl = "";
        this.#nowUrl = "";
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
        this.#prevUrl = this.#nowUrl;
        this.#nowUrl = location.pathname + location.search;
    }

    getNextUrl() {
        const result = this.#locationParts.splice(0, 1)[0];
        return result;
    }

    getNextUrlNotRemove() {
        return this.#locationParts[0];
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

    isUrlChanged(): boolean {
        return this.#nowUrl !== this.#prevUrl;
    }

    #parseLocation() {
        const pathname = location.pathname.slice(1);
        this.#locationParts = pathname.split("/").map((value) => "/" + value);
        this.#searchParams = new URLSearchParams(location.search);
    }

    #onPopState() {
        this.#parseLocation();
        this.#emit();
    }
}

export const router = new Router();
