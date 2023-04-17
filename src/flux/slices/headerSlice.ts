import { createSlice } from "flux/slice";

import { Action, PayloadAction } from "flux/action";
import { LoadStatus } from "requests/LoadStatus";

type TCity = {
    id: number;
    name: string;
};

interface HeaderState {
    categories: string[];
    selectedCategoryId: number | undefined;
    citiesLoadStatus: LoadStatus.Type;
    cities: TCity[];
    selectedCityId: number | undefined;
    searchQuery: string | undefined;
}

const initialState: HeaderState = {
    categories: [],
    selectedCategoryId: undefined,
    citiesLoadStatus: LoadStatus.NONE,
    cities: [],
    selectedCityId: 1,
    searchQuery: undefined,
};

type TCategory = { id: number; name: string };

const headerSlice = createSlice({
    name: "header",
    initialState: initialState,
    reducers: {
        setCities: (state, action: PayloadAction<{ cities: TCity[] }>) => {
            state.cities = action.payload.cities;
            state.citiesLoadStatus = LoadStatus.DONE;
            return state;
        },
        setCategories: (state, action: PayloadAction<{ categories: TCategory[] }>) => {
            state.categories = action.payload.categories.map((category: TCategory) => category.name);
            return state;
        },
        selectCity: (state, action: PayloadAction<{ city: number | string | TCity | undefined }>) => {
            const city = action.payload?.city;
            if (typeof city == "number") {
                state.selectedCityId = city;
            } else if (typeof city == "string") {
                state.selectedCityId = state.cities.find((el) => el.name === city)?.id || 1;
            } else {
                state.selectedCityId = city?.id || 1;
            }
            return state;
        },
        selectCategory: (state, action) => {
            const category = action.payload.category;
            if (typeof category == "number") {
                state.selectedCategoryId = category;
            } else {
                state.selectedCategoryId = state.cities.findIndex((el) => el === category);
            }
            return state;
        },
        clearCategory: (state) => {
            state.selectedCategoryId = undefined;
            return state;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            return state;
        },
        clearSearchQuery: (state) => {
            state.searchQuery = undefined;
            return state;
        },
    },
});

export const getSelectedCityName = (state: HeaderState): string | undefined => {
    return state.cities.find((city) => city.id === state.selectedCityId)?.name;
};

export const getCitiesNames = (state: HeaderState): string[] => {
    return state.cities.map((city) => city.name);
};

export const getSelectedCategory = (state: HeaderState): string | undefined => {
    if (state.selectedCategoryId !== undefined) {
        return state.categories[state.selectedCategoryId];
    }

    return undefined;
};

export const { setCities, setCategories, selectCity, selectCategory, clearCategory, setSearchQuery, clearSearchQuery } =
    headerSlice.actions;

export default headerSlice;
