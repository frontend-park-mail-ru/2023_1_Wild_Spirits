import { createSlice } from "flux/slice";

interface TagsState {
    tags: {[key: string]: {
        id: number,
        selected: boolean
    }}
}

const initialState: TagsState = {tags: {}}

const tagsSlice = createSlice({
    name: "tags",
    initialState: initialState,
    reducers: {
        setTags: (state, action) => {
            const tags: {id: string, name: string}[] = action.payload.tags;
            state.tags = Object.fromEntries(tags.map(({id, name}) => [name, {id: parseInt(id), selected: false}]));
            return state;
        },
        toggleTag: (state, action) => {
            const tag = action.payload.tag;
            if (state.tags[tag] === undefined) {
                return state;
            }

            state.tags[tag].selected = !state.tags[tag].selected;
            return state
        }
    }
});

export const getSelectedTags = (state: TagsState): string[] => {
    return Object.entries(state.tags)
                 .filter(([_, {id, selected}]) => selected)
                 .map(([tag, _]) => tag);
}

export const { setTags, toggleTag } = tagsSlice.actions;
export default tagsSlice;
