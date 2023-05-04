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
    calendarModalShown: boolean;
}

const initialState: MetaState = {
    collapsed: initialCollapsed,
    calendarModalShown: false
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
        openCalendarModal: (state: MetaState) => {
            state.calendarModalShown = true;
            return state;
        },
        closeCalendarModal: (state: MetaState) => {
            state.calendarModalShown = false;
            return state;
        },
    },
});

export const { setCollapsed, openCalendarModal, closeCalendarModal } = metaSlice.actions;

export default metaSlice;
