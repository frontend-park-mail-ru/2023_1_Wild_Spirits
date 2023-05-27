import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";

const isCollapsed = (width: number) => !window.matchMedia(`(min-width:${width}px)`).matches;

type ChangeMetaOnResizeType = {
    xsCollapsed: () => boolean;
    searchCollapsed: () => boolean;
    headerCollapsed: () => boolean;
    lCollapsed: () => boolean;
    profileCollapsed: () => boolean;
    xxlCollapsed: () => boolean;
};

export const changeMetaOnResize: ChangeMetaOnResizeType = {
    xsCollapsed: () => isCollapsed(400),
    searchCollapsed: () => isCollapsed(600),
    headerCollapsed: () => isCollapsed(850),
    lCollapsed: () => isCollapsed(1000),
    profileCollapsed: () => isCollapsed(1250),
    xxlCollapsed: () => isCollapsed(1550),
};

type CollapsedMeta = { [key in keyof typeof changeMetaOnResize]: boolean };

export const createCollapsed = () => {
    return Object.fromEntries(
        Object.entries(changeMetaOnResize).map(([key, func]) => {
            return [key, func()];
        })
    ) as CollapsedMeta;
};

const initialCollapsed = createCollapsed();

interface MetaState {
    collapsed: CollapsedMeta;
    mobileSearch: boolean;
    inviteModalEventId: number;
}

const initialState: MetaState = {
    collapsed: initialCollapsed,
    mobileSearch: false,
    inviteModalEventId: -1,
};

const metaSlice = createSlice({
    name: "meta",
    initialState: initialState,
    reducers: {
        setCollapsed: (state: MetaState, action: PayloadAction<CollapsedMeta>) => {
            state.collapsed = action.payload;
            return state;
        },
        openMobileSearch: (state: MetaState) => {
            state.mobileSearch = true;
            return state;
        },
        closeMobileSearch: (state: MetaState) => {
            state.mobileSearch = false;
            return state;
        },
        setInviteModalEventId: (state: MetaState, action: PayloadAction<number>) => {
            state.inviteModalEventId = action.payload;
            return state;
        },
    },
});

export const { setCollapsed, openMobileSearch, closeMobileSearch, setInviteModalEventId } = metaSlice.actions;

export default metaSlice;
