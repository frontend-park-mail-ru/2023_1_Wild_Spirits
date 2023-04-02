import { ModalWindow } from "components/ModalWindow/ModalWindow";
import { createSlice } from "flux/slice";

export namespace ModalWindowName {
    export const NONE = "NONE";
    export const LOGIN = "login";
    export const REGISTER = "register";

    export type NameType = typeof NONE | typeof LOGIN | typeof REGISTER;
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
            return { name: state.name };
        },
        openLogin: (state) => {
            state.name = ModalWindowName.LOGIN;
            return state;
        },
        openRegister: (state) => {
            state.name = ModalWindowName.REGISTER;
            return state;
        },
    },
});

export const { close, openLogin, openRegister } = modalWindowSlice.actions;

export default modalWindowSlice;
