import { Action, PayloadAction } from "./action";
import { TReducer } from "./store";

type CaseReducer<TState, TAction extends Action = Action> = (state: TState, action: TAction) => TState;

type SliceCaseReducers<TState> = {
    [key: string]: CaseReducer<TState, PayloadAction<any>>;
};

type PayloadActionCreator<P> = (payload: P) => PayloadAction<P>;

type ActionCreatorWithoutPayload = () => Action;

type ActionCreatorForCaseReducer<TCaseReducer> = TCaseReducer extends (state: any, action: infer TAction) => any
    ? TAction extends { payload: infer TPayload }
        ? PayloadActionCreator<TPayload>
        : ActionCreatorWithoutPayload
    : ActionCreatorWithoutPayload;

type CaseReducerActions<TCaseReducers extends SliceCaseReducers<any>> = {
    [Type in keyof TCaseReducers]: ActionCreatorForCaseReducer<TCaseReducers[Type]>;
};

interface SliceProps<TState, TCaseReducers extends SliceCaseReducers<TState> = SliceCaseReducers<TState>> {
    name: string;
    initialState: TState;
    reducers: TCaseReducers;
}

export interface Slice<TState, TCaseReducers extends SliceCaseReducers<TState> = SliceCaseReducers<TState>> {
    name: string;
    reducer: TReducer<TState>;
    actions: CaseReducerActions<TCaseReducers>;
    state: TState;
}

const GetReducerType = (name: string, key: string) => `${name}/${key}`;

export function createSlice<TState, TCaseReducers extends SliceCaseReducers<TState>>({
    name,
    initialState,
    reducers,
}: SliceProps<TState, TCaseReducers>): Slice<TState, TCaseReducers> {
    const actionCreators = Object.fromEntries(
        Object.keys(reducers).map((key) => {
            return [
                key,
                (payload?: any) => {
                    return { type: GetReducerType(name, key), payload };
                },
            ];
        })
    );

    return {
        name,
        state: initialState,
        reducer: (state: TState, action: Action): TState => {
            for (const [key, value] of Object.entries(reducers)) {
                if (action.type === GetReducerType(name, key)) {
                    return value(structuredClone(state), action as PayloadAction<any>);
                }
            }
            return state;
        },
        actions: actionCreators as unknown as CaseReducerActions<TCaseReducers>,
    };
}
