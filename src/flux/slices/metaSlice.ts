import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";

const isCollapsed = (width: number) => window.matchMedia(`(max-width:${width}px)`).matches;

type ChangeMetaOnResizeType = { [key: string]: () => boolean };

export const changeMetaOnResize: ChangeMetaOnResizeType = {
    searchCollapsed: () => isCollapsed(500),
    headerCollapsed: () => isCollapsed(850),
    profileCollapsed: () => isCollapsed(1250),
    eventPageCollapsed: () => isCollapsed(1100),
};

type CollapsedMeta = { [key in keyof typeof changeMetaOnResize]: boolean };

export const createCollapsed = () =>
    Object.fromEntries(
        Object.entries(changeMetaOnResize).map(([key, func]) => {
            return [key, func()];
        })
    );

const initialCollapsed = createCollapsed();

interface MetaState {
    collapsed: CollapsedMeta;
}

const initialState: MetaState = {
    collapsed: initialCollapsed,
};

const metaSlice = createSlice({
    name: "meta",
    initialState: initialState,
    reducers: {
        setCollapsed: (state: MetaState, action: PayloadAction<CollapsedMeta>) => {
            state.collapsed = action.payload;
            console.log(state.collapsed);
            return state;
        },
    },
});

export const { setCollapsed } = metaSlice.actions;

export default metaSlice;
