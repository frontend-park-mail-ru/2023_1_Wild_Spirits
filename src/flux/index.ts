import { Store } from "./store";
import { Slice } from "./slice";
import userSlice from "./slices/userSlice";
import modalWindowSlice from "./slices/modalWindowSlice";
import { Action } from "./action";

export type SlicesMapObject<S = any> = {
    [K in keyof S]: Slice<S[K]>;
};

const configureStore = <S>(slices: SlicesMapObject<S>): Store<S> => {
    return new Store(
        Object.fromEntries(
            Object.entries(slices).map(([key, value]) => {
                console.log(key);
                return [key, (value as Slice<any>).state];
            })
        ) as S,
        Object.fromEntries(
            Object.entries(slices).map(([key, value]) => {
                return [key, (value as Slice<any>).reducer];
            })
        )
    );
};

export let store = configureStore({ user: userSlice, modalWindow: modalWindowSlice });
console.log(store);

// export let store = new Store(initialState, reducers);
