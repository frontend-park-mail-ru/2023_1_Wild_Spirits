import { Store } from "./store";
import { Slice } from "./slice";
import userSlice from "./slices/userSlice";
import modalWindowSlice from "./slices/modalWindowSlice";

const configureStore = (slices: Slice<any>[]) => {
    const initialState = Object.fromEntries(
        slices.map((slice) => {
            return [slice.name, slice.state];
        })
    );
    return new Store<typeof initialState>(
        initialState,
        Object.fromEntries(
            slices.map((slice) => {
                return [slice.name, slice.reducer];
            })
        )
    );
};

export let store = configureStore([userSlice, modalWindowSlice]);

// export let store = new Store(initialState, reducers);
