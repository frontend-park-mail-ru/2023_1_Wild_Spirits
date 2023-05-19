import { TRequest } from "./requestTypes";

interface RequestProps {
    name: string;
    callback: () => void;
    dependencies: string[];
}

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : any;

class RequestManager {
    #requests: { [key: string]: { callback: (...args: any[]) => void; dependencies: string[] } };
    #doneRequests: Set<string>;
    #runningRequests: Set<{ name: string; args: any[] }>;
    #awaitingRequests: Set<{ name: string; args: any[] }>;

    constructor() {
        this.#requests = {};
        this.#doneRequests = new Set();
        this.#runningRequests = new Set();
        this.#awaitingRequests = new Set();
    }

    checkForCircularDependencies() {
        const nodes = Object.entries(this.#requests).map(([name, { dependencies }]) => ({
            name,
            dependencies: new Set(dependencies),
        }));

        const startNodes = nodes.filter(({ dependencies }) => dependencies.size === 0);

        const S = new Set<string>(startNodes.map((node) => node.name));

        for (const n of S) {
            for (const node of nodes) {
                node.dependencies.delete(n);
                if (node.dependencies.size === 0) {
                    S.add(node.name);
                }
            }
        }

        if (nodes.filter((node) => node.dependencies.size > 0).length > 0) {
            throw new Error("Circular dependencies in requestManager detected");
        }
    }

    add({ name, callback, dependencies }: RequestProps) {
        this.#requests[name] = {
            callback,
            dependencies,
        };
    }

    removeDone<T extends TRequest | string>(request: T) {
        const name = typeof request === "string" ? request : request.name;

        this.#doneRequests.delete(name);
    }

    #removeRunning(name: string) {
        for (const req of this.#runningRequests) {
            if (req.name === name) {
                this.#runningRequests.delete(req);
            }
        }
    }

    #removeAwaiting(name: string) {
        for (const req of this.#awaitingRequests) {
            if (req.name === name) {
                this.#awaitingRequests.delete(req);
            }
        }
    }

    resolveRequest(name: string) {
        this.#doneRequests.add(name);
        this.#removeRunning(name);
        this.#removeAwaiting(name);
        this.#onRequestResolution(name);
    }

    #onRequestResolution(name: string) {
        Array.from(this.#awaitingRequests)
            .filter((request) => this.#requests[request.name].dependencies.includes(name))
            .forEach(({ name: reqName, args }) => {
                if (!this.#isRunning(reqName)) {
                    this.request(reqName, ...args);
                }
            });
    }

    #isRunning(name: string): boolean {
        let result = false;
        this.#runningRequests.forEach(({ name: reqName }) => (result = result || name === reqName));
        return result;
    }

    #isAwaiting(name: string): boolean {
        let result = false;
        this.#awaitingRequests.forEach(({ name: reqName }) => (result = result || name === reqName));
        return result;
    }

    request<T extends TRequest | string>(request: T, ...args: Parameters<OmitFirstArg<T>>) {
        const name = typeof request === "string" ? request : request.name;

        this.#doneRequests.delete(name);

        let dependencyCnt = 0;

        this.#requests[name].dependencies.forEach((dependencyName) => {
            if (!this.#doneRequests.has(dependencyName)) {
                dependencyCnt++;
            }
        });

        if (dependencyCnt === 0) {
            this.#runningRequests.add({ name, args });
            if (this.#isAwaiting(name)) {
                this.#removeAwaiting(name);
            }
            this.#requests[name].callback(...args);
        } else {
            if (!this.#isAwaiting(name)) {
                this.#awaitingRequests.add({ name, args });
            }
        }
    }
}

export const configureRequestManager = (requests: { request: TRequest; dependencies: TRequest[] }[]) => {
    const requestManager = new RequestManager();
    requests.forEach(({ request, dependencies }) => {
        const name = request.name;
        const resolver = () => {
            requestManager.resolveRequest(name);
        };
        const callback = (...args: any[]) => {
            request(resolver, ...args);
        };

        requestManager.add({
            name: name,
            callback: callback,
            dependencies: dependencies.map((dep) => dep.name),
        });
    });
    requestManager.checkForCircularDependencies();
    return requestManager;
};
