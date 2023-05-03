import { createSlice } from "flux/slice";

export namespace ModalWindowName {
    export const NONE = "NONE";
    export const LOGIN = "login";
    export const REGISTER = "register";
    export const FRIEND_LIST = "friend-list";
    export const CITY_SELECTOR = "city-selector";
    export const ORGANIZER = "organizer";

    export type NameType =
        | typeof NONE
        | typeof LOGIN
        | typeof REGISTER
        | typeof FRIEND_LIST
        | typeof CITY_SELECTOR
        | typeof ORGANIZER;
}

interface ModalWindowState {
    name: ModalWindowName.NameType;
}

const initialState: ModalWindowState = {
    name: ModalWindowName.NONE,
};

const modalWindowSlice = createSlice({
    name: "modalWindow",
    initialState: initialState,
    reducers: {
        close: (state: ModalWindowState) => {
            state.name = ModalWindowName.NONE;
            return state;
        },
        openLogin: (state: ModalWindowState) => {
            state.name = ModalWindowName.LOGIN;
            return state;
        },
        openRegister: (state: ModalWindowState) => {
            state.name = ModalWindowName.REGISTER;
            return state;
        },
        openFriendsList: (state) => {
            state.name = ModalWindowName.FRIEND_LIST;
            return state;
        },
        openCitySelector: (state) => {
            state.name = ModalWindowName.CITY_SELECTOR;
            return state;
        },
        openOrganizerModal: (state) => {
            state.name = ModalWindowName.ORGANIZER;
            return state;
        },
    },
});

export const { close, openLogin, openRegister, openFriendsList, openCitySelector, openOrganizerModal } =
    modalWindowSlice.actions;

export default modalWindowSlice;
