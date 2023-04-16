import { loadCities } from "./header"
import { loadAuthorization } from "./user"

interface RequestProps {
    name: string
    callback: () => void
    dependencies: string[]
}

class RequestManager {
    #requests: {[key: string]: {callback: () => void, dependencies: string[]}}
    #doneRequests: Set<string>
    #awaitingRequests: Set<string>

    constructor() {
        this.#requests = {}
        this.#doneRequests = new Set()
        this.#awaitingRequests = new Set
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

    request(name: string) {
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
            this.#requests[name].callback();
        }
    }
}

export let requestManager = new RequestManager();

const requests = [
    {
        name: "loadAuthorization",
        callback: loadAuthorization,
        dependencies: []
    },
    {
        name: "loadCities",
        callback: () => loadCities(),
        dependencies: ['loadAuthorization']
    },
]

requests.forEach(request => requestManager.add(request));
