import { createSlice } from "flux/slice";

interface TagsState {
    [key: string]: boolean,
}

const tagNames = ["Бесплатно", "С друзьями", "С детьми", "Всей семьёй", "Для пенсионеров",
"Вечером", "Тематические праздники", "Мастер-классы", "Со второй половинкой"];

const generateInitialTagsState = (tagNames: string[]) => Object.fromEntries(tagNames.map((tagName: string)=>([tagName, false])));

const initialState: TagsState = generateInitialTagsState(tagNames);

const tagsSlice = createSlice({
    name: "tags",
    initialState: initialState,
    reducers: {
        toggleTag: (state, action) => {
            const tag = action.payload.tag;
            if (state[tag] == undefined) {
                return state;
            }

            state[tag] = !state[tag];
            return state
        }
    }
});

export const getSelectedTags = (state: TagsState) => {
    return Object.entries(state)
                 .filter(([_, isActive])=>isActive)
                 .map(([tagName, _]) => tagName);
}

export const { toggleTag } = tagsSlice.actions;
export default tagsSlice;
