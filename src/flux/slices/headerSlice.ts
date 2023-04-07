import { createSlice } from "flux/slice";

interface HeaderState {
    categories: string[];
    selectedCategoryId: number | undefined;
    cities: string[];
    selectedCityId: number;
}

const initialState: HeaderState = {
    categories: [],
    selectedCategoryId: undefined,
    cities: [],
    selectedCityId: 0,
};

const headerSlice = createSlice({
    name: "header",
    initialState: initialState,
    reducers: {
        setCities: (state, action) => {
            state.cities = action.payload.cities;
            return state;
        },
        setCategories: (state, action) => {
            state.categories = action.payload.categories;
            return state;
        },
        selectCity: (state, action) => {
            const city = action.payload.city;
            if (typeof city == "number") {
                state.selectedCityId = city;
            } else {
                state.selectedCityId = state.cities.findIndex((el)=>el===city);
            }
            return state;
        },
        selectCategory: (state, action) => {
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

export const getSelectedCity = (state: HeaderState): string => state.cities[state.selectedCityId];
export const getSelectedCategory = (state: HeaderState): string | undefined => {
    if (state.selectedCategoryId) {
        return state.categories[state.selectedCategoryId];
    }

    return undefined;
}

export const { setCities, setCategories, selectCity, selectCategory } = headerSlice.actions;
export default headerSlice;
