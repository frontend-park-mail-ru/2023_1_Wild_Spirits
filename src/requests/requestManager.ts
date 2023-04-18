import { Exception } from "handlebars";
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
    #awaitingRequests: Set<{ name: string; args: any[] }>;

    constructor() {
        this.#requests = {};
        this.#doneRequests = new Set();
        this.#awaitingRequests = new Set();
    }

    checkForCircularDependencies() {
        let nodes = Object.entries(this.#requests).map(([name, { callback, dependencies }]) => ({
            name,
            dependencies: new Set(dependencies),
        }));

        const startNodes = nodes.filter(({ name, dependencies }) => dependencies.size === 0);

        let S = new Set<string>(startNodes.map((node) => node.name));

        for (const n of S) {
            for (let node of nodes) {
                node.dependencies.delete(n);
                if (node.dependencies.size === 0) {
                    S.add(node.name);
                }
            }
        }

        if (nodes.filter((node) => node.dependencies.size > 0).length > 0) {
            throw new Exception("Circular dependencies in requestManager detected");
        }
    }

    add({ name, callback, dependencies }: RequestProps) {
        this.#requests[name] = {
            callback,
            dependencies,
        };
    }

    resolveRequest(name: string, args: any[]) {
        this.#doneRequests.add(name);
        this.#awaitingRequests.delete({ name: name, args: args });
        this.#onRequestResolution(name);
    }

    #onRequestResolution(name: string) {
        Array.from(this.#awaitingRequests)
            .filter((request) => this.#requests[request.name].dependencies.includes(name))
            .forEach(({ name, args }) => {
                this.request(name, ...args);
            });
    }

    request<T extends TRequest | string>(request: T, ...args: Parameters<OmitFirstArg<T>>) {
        //        const name = typeof request === 'function' ? request.name : request;
        const name = typeof request === "string" ? request : request.name;

        this.#awaitingRequests.add({ name: name, args: args });
        let dependencyCnt = 0;

        this.#requests[name].dependencies.forEach((dependencyName) => {
            if (!this.#doneRequests.has(dependencyName)) {
                const awaitingRequestsNames = Array.from(this.#awaitingRequests).map((request) => request.name);
                if (!awaitingRequestsNames.includes(dependencyName)) {
                    this.request(dependencyName);
                }
                dependencyCnt++;
            }
        });

        if (dependencyCnt === 0) {
            this.#requests[name].callback(...args);
        }
    }
}

export const configureRequestManager = (requests: { request: TRequest; dependencies: TRequest[] }[]) => {
    let requestManager = new RequestManager();
    requests.forEach(({ request, dependencies }) => {
        const name = request.name;
        const resolver = (args: any[]) => {
            requestManager.resolveRequest(name, args);
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
