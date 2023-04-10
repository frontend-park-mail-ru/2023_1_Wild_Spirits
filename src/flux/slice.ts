import { Action } from "./action";
import { TReducer } from "./store";

interface SliceProps<TState> {
    name: string;
    initialState: TState;
    reducers: { [key: string]: TReducer<TState, any> };
}

type ActionsType = { [key: string]: (payload?: any) => Action<any> };

export interface Slice<TState> {
    name: string;
    reducer: TReducer<TState, Action<any>>;
    actions: ActionsType;
    state: TState;
}

const GetReducerType = (name: string, key: string) => `${name}/${key}`;

export function createSlice<TState>({ name, initialState, reducers }: SliceProps<TState>): Slice<TState> {
    return {
        name,
        state: initialState,
        reducer: (state: TState, action: Action<any>): TState => {
            for (const [key, value] of Object.entries(reducers)) {
                if (action.type === GetReducerType(name, key)) {
                    return value(state, action);
                }
            }
            return state;
        },
        actions: Object.fromEntries(
            Object.keys(reducers).map((key) => {
                return [
                    key,
                    (payload?: any) => {
                        return { type: GetReducerType(name, key), payload };
                    },
                ];
            })
        ),
    };
}
