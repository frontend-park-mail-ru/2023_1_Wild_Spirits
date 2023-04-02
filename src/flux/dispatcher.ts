export type DispatchToken = string

export class Dispatcher<TPayload> {
    callbacks: {[key: DispatchToken]: (payload: TPayload)=>void};
    constructor() {
        this.callbacks = {};
    }

    register(token: DispatchToken, callback: (payload: TPayload)=>void) {
        this.callbacks[token] = callback;
    }

    unregister(token: DispatchToken) {
        delete this.callbacks[token];
    }

    dispatch(token: DispatchToken, payload: TPayload) {
        this.callbacks[token](payload);
    }
}
