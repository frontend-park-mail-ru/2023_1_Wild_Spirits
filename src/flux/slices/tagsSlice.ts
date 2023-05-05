import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";
import { TTag } from "models/Tag";

export type StateTagsType = {
    [key: string]: {
        id: number;
        selected: boolean;
    };
};

export interface TagsState {
    tags: StateTagsType | null;
}

const initialState: TagsState = { tags: {} };

const tagsSlice = createSlice({
    name: "tags",
    initialState: initialState,
    reducers: {
        setTags: (state: TagsState, action: PayloadAction<{ tags: TTag[] }>) => {
            const tags: TTag[] = action.payload.tags;
            state.tags = Object.fromEntries(tags.map(({ id, name }) => [name, { id: parseInt(id), selected: false }]));
            return state;
        },
        toggleTag: (state: TagsState, action: PayloadAction<{ tag: string }>) => {
            if (state.tags === null) {
                return state;
            }

            const tag = action.payload.tag;
            if (state.tags[tag] === undefined) {
                return state;
            }

            state.tags[tag].selected = !state.tags[tag].selected;
            return state;
        },
    },
});

export const getSelectedTags = (state: TagsState): string[] => {
    if (state.tags === null) {
        return [];
    }
    return Object.entries(state.tags)
        .filter(([_, { selected }]) => selected)
        .map(([tag, _]) => tag);
};

export const { setTags, toggleTag } = tagsSlice.actions;
export default tagsSlice;
