import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";
import { TTag } from "models/Tag";

export interface TagsState {
    tags: {
        [key: string]: {
            id: number;
            selected: boolean;
        };
    };
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
    return Object.entries(state.tags)
        .filter(([_, { selected }]) => selected)
        .map(([tag, _]) => tag);
};

export const { setTags, toggleTag } = tagsSlice.actions;
export default tagsSlice;
