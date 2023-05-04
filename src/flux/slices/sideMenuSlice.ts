import { createSlice } from "flux/slice";

interface SideMenuState {
    isOpen: boolean;
    categoriesOpen: boolean;
    citiesOpen: boolean;
}

const friendListInitialState: SideMenuState = {
    isOpen: false,
    categoriesOpen: false,
    citiesOpen: false
}

const sideMenuSlice = createSlice({
    name: "sideMenuSlice",
    initialState: friendListInitialState,
    reducers: {
        openSideMenu: (state: SideMenuState) => {
            state.isOpen = true;
            return state;
        },
        closeSideMenu: (state: SideMenuState) => {
            state.isOpen = false;
            return state;
        },
        openSideMenuCategories: (state: SideMenuState) => {
            state.categoriesOpen = true;
            return state;
        },
        closeSideMenuCategories: (state: SideMenuState) => {
            state.categoriesOpen = false;
            return state;
        },
        openSideMenuCities: (state: SideMenuState) => {
            state.citiesOpen = true;
            return state;
        },
        closeSideMenuCities: (state: SideMenuState) => {
            state.citiesOpen = false;
            return state;
        }
    }
})

export const {
    openSideMenu,
    closeSideMenu,
    openSideMenuCategories, 
    closeSideMenuCategories ,
    openSideMenuCities,
    closeSideMenuCities,
} = sideMenuSlice.actions;
export default sideMenuSlice
