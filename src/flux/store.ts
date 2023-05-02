import { Action } from "./action";

export type TReducer<TSliceState, TAction extends Action = Action> = (
    sliceState: TSliceState,
    action: TAction
) => TSliceState;
export type TReducers = { [key: string]: TReducer<any, any> };

export class Store<TState> {
    #state: TState;
    #reducers: TReducers;
    #callbacks: (() => void)[];
    constructor(state: TState, reducers: TReducers) {
        this.#state = state;
        this.#reducers = reducers;
        this.#callbacks = [];

        this.dispatch = this.dispatch.bind(this);
    }

    subscribe(callback: () => void) {
        this.#callbacks.push(callback);
    }

    get state(): Readonly<TState> {
        return this.#state;
    }

    dispatch(...actions: Action[]) {
        for (const name in this.state) {
            actions.forEach((action) => {
                this.#state[name] = this.#reducers[name](this.#state[name], action);
            });
        }

        this.#callbacks.forEach((callback) => callback());
    }
}
