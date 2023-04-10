import { Action } from "./action";

export type TReducer<TSliceState, TPayload> = (sliceState: TSliceState, action: Action<TPayload>) => TSliceState;
export type TReducers = { [key: string]: TReducer<any, any> };

export class Store<TState> {
    state: TState;
    reducers: TReducers;
    callbacks: (() => void)[];
    constructor(state: TState, reducers: TReducers) {
        this.state = state;
        this.reducers = reducers;
        this.callbacks = [];
    }

    subscribe(callback: () => void) {
        this.callbacks.push(callback);
    }

    getState(): TState {
        return this.state;
    }

    dispatch<TPayload>(...actions: Action<TPayload>[]) {
        for (const name in this.state) {
            actions.forEach((action) => {
                this.state[name] = this.reducers[name](this.state[name], action);
            });
        }

        this.callbacks.forEach((callback) => callback());
    }
}
