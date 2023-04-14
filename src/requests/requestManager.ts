interface RequestManagerAddProps {
    name: string;
    after: string;
    callback: () => void;
}

class RequestManager {
    #done: string[] = [];
    constructor() {}

    add({ name, after, callback }: RequestManagerAddProps) {}
}

export let requestManager = new RequestManager();
