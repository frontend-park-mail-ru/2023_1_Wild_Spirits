import { createSlice } from "flux/slice";

export namespace ModalWindowName {
    export const NONE = "NONE";
    export const LOGIN = "login";
    export const REGISTER = "register";
    export const FRIEND_LIST = "friend-list";
    export const CITY_SELECTOR = "city-selector";
    export const ORGANIZER = "organizer";
    export const CALENDAR = "calendar";
    export const SEARCH = "search";
    export const NOTIFICATION = "notification";
    export const INVITE = "invite";

    export type NameType =
        | typeof NONE
        | typeof LOGIN
        | typeof REGISTER
        | typeof FRIEND_LIST
        | typeof CITY_SELECTOR
        | typeof ORGANIZER
        | typeof CALENDAR
        | typeof NOTIFICATION
        | typeof INVITE;
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
        closeModal: (state: ModalWindowState) => {
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
        openFriendsList: (state: ModalWindowState) => {
            state.name = ModalWindowName.FRIEND_LIST;
            return state;
        },
        openCitySelector: (state: ModalWindowState) => {
            state.name = ModalWindowName.CITY_SELECTOR;
            return state;
        },
        openOrganizerModal: (state: ModalWindowState) => {
            state.name = ModalWindowName.ORGANIZER;
            return state;
        },
        openCalendarModal: (state: ModalWindowState) => {
            state.name = ModalWindowName.CALENDAR;
            return state;
        },
        openNotificationModal: (state: ModalWindowState) => {
            state.name = ModalWindowName.NOTIFICATION;
            return state;
        },
        openInviteModal: (state: ModalWindowState) => {
            state.name = ModalWindowName.INVITE;
            return state;
        },
    },
});

export const {
    closeModal,
    openLogin,
    openRegister,
    openFriendsList,
    openCitySelector,
    openOrganizerModal,
    openCalendarModal,
    openNotificationModal,
    openInviteModal,
} = modalWindowSlice.actions;

export default modalWindowSlice;
