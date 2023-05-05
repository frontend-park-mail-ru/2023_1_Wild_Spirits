import { createSlice } from "flux/slice";

import { PayloadAction } from "flux/action";
import { LoadStatus } from "requests/LoadStatus";
import { TCategory } from "models/Category";

export type TCity = {
    id: number;
    name: string;
};

interface HeaderState {
    categories: TCategory[];
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

const headerSlice = createSlice({
    name: "header",
    initialState: initialState,
    reducers: {
        setCities: (state: HeaderState, action: PayloadAction<{ cities: TCity[] }>) => {
            state.cities = action.payload.cities;
            state.citiesLoadStatus = LoadStatus.DONE;
            return state;
        },
        setCategories: (state: HeaderState, action: PayloadAction<TCategory[]>) => {
            state.categories = action.payload;
            return state;
        },
        selectCity: (state: HeaderState, action: PayloadAction<{ city: number | string | TCity | undefined }>) => {
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
        selectCategory: (state: HeaderState, action: PayloadAction<number | string>) => {
            if (typeof action.payload == "number") {
                state.selectedCategoryId = action.payload;
            } else {
                state.selectedCategoryId = state.categories.findIndex((el) => el.id === action.payload);
            }
            return state;
        },
        clearCategory: (state: HeaderState) => {
            state.selectedCategoryId = undefined;
            return state;
        },
        setSearchQuery: (state: HeaderState, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            return state;
        },
        clearSearchQuery: (state: HeaderState) => {
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

export const getSelectedCategory = (state: HeaderState): TCategory | undefined => {
    return state.categories.find((el) => el.id === state.selectedCategoryId);
};

export const { setCities, setCategories, selectCity, selectCategory, clearCategory, setSearchQuery, clearSearchQuery } =
    headerSlice.actions;

export default headerSlice;
