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
            state[tag] = !state[tag];
            console.log(action)
            return state
        }
    }
});

export const { toggleTag } = tagsSlice.actions;
export default tagsSlice;
