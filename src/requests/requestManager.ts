import { Exception } from "handlebars"
import { TRequest } from "./requestTypes"

interface RequestProps {
    name: string
    callback: () => void
    dependencies: string[]
}

class RequestManager {
    #requests: {[key: string]: {callback: (...args: any[]) => void, dependencies: string[]}}
    #doneRequests: Set<string>
    #awaitingRequests: Set<string>

    constructor() {
        this.#requests = {}
        this.#doneRequests = new Set()
        this.#awaitingRequests = new Set
    }

    checkForCircularDependencies () {
        let nodes = Object.entries(this.#requests)
                           .map(([name, {callback, dependencies}]) => ({name, dependencies: new Set(dependencies)}));



        const startNodes = nodes.filter(({name, dependencies}) => dependencies.size === 0);

        let S = new Set<string>(startNodes.map(node => node.name));

        for (const n of S) {
            for (let node of nodes) {
                node.dependencies.delete(n);
                if  (node.dependencies.size === 0) {
                    S.add(node.name);
                }
            }
        }

        if (nodes.filter(node => node.dependencies.size > 0).length > 0) {
            throw new Exception("Circular dependencies in requestManager detected");
        }
    }

    add({name, callback, dependencies}: RequestProps) {
        this.#requests[name] = {
            callback,
            dependencies
        }
    }

    resolveRequest(name: string) {
        this.#doneRequests.add(name);
        this.#awaitingRequests.delete(name);
        this.#onRequestResolution(name);
    }

    #onRequestResolution(name: string) {
        [...this.#awaitingRequests]
            .filter(requestName => this.#requests[requestName].dependencies.includes(name))
            .forEach(requestName => {
                this.request(requestName);
            });
    }

    request(name: string, ...args: any[]) {
        this.#awaitingRequests.add(name);
        let dependencyCnt = 0

        this.#requests[name].dependencies.forEach(dependencyName => {
            if (!this.#doneRequests.has(dependencyName)) {
                if (!this.#awaitingRequests.has(dependencyName)) {
                    this.request(dependencyName);
                }
                dependencyCnt++;
            }
        });

        if (dependencyCnt === 0) {
            this.#requests[name].callback(args);
        }
    }
}

export const configureRequestManager = (requests: {request: TRequest, dependencies: TRequest[]}[]) => {
    let requestManager = new RequestManager();
    requests.forEach(({request, dependencies}) => {
        const name = request.name;
        const resolver = () => requestManager.resolveRequest(name);
        const callback = (...args: any[]) => request(resolver, args);

        requestManager.add({
            name: name,
            callback: callback,
            dependencies: dependencies.map(dep => dep.name)
        });
        
    });
    requestManager.checkForCircularDependencies();
    return requestManager;
}

