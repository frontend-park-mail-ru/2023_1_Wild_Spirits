import { createSlice } from "flux/slice";

export namespace ModalWindowName {
    export const NONE = "NONE";
    export const LOGIN = "login";
    export const REGISTER = "register";
    export const FRIENDLIST = "friend-list";

    export type NameType = typeof NONE | typeof LOGIN | typeof REGISTER | typeof FRIENDLIST
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
        close: (state) => {
            state.name = ModalWindowName.NONE;
            return state;
        },
        openLogin: (state) => {
            state.name = ModalWindowName.LOGIN;
            return state;
        },
        openRegister: (state) => {
            state.name = ModalWindowName.REGISTER;
            return state;
        },
        openFriendsList: (state) => {
            state.name = ModalWindowName.FRIENDLIST;
            return state;
        }
    },
});

export const { close, openLogin, openRegister, openFriendsList } = modalWindowSlice.actions;

export default modalWindowSlice;
