import { createSlice } from "flux/slice";

interface HeaderState {
    categories: string[];
    selectedCategoryId: number | undefined;
    cities: string[];
    selectedCityId: number;
}

const initialState: HeaderState = {
    categories: ["Концерты", "Театр", "Кино", "Фестивали", "Выставки"],
    selectedCategoryId: undefined,
    cities: ["Москва", "Санкт-Петербург", "Нижний Новгород"],
    selectedCityId: 0,
};

const headerSlice = createSlice({
    name: "header",
    initialState: initialState,
    reducers: {
        setCity: (state, action) => {
            const city = action.payload.city;
            if (typeof city == "number") {
                state.selectedCityId = city;
            } else {
                state.selectedCityId = state.cities.findIndex((el)=>el===city);
            }
            return state;
        },
        setCategory: (state, action) => {
            const category = action.payload.category;
            if (typeof category == "number") {
                state.selectedCategoryId = category;
            } else {
                state.selectedCategoryId = state.cities.findIndex((el)=>el===category);
            }
            return state;
        }
    }
});

export const getCity = (state: HeaderState): string => state.cities[state.selectedCityId];
export const getCategory = (state: HeaderState): string | undefined => {
    if (state.selectedCategoryId) {
        return state.categories[state.selectedCategoryId];
    }

    return undefined;
}

export const { setCity, setCategory } = headerSlice.actions;
export default headerSlice;
