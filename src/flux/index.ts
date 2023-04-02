import { Store, TReducer, TReducers } from './store'
import { Action } from './action'

interface UserState {
    data?: {
        name: string,
        img: string
    }
}

export namespace ModalWindowName {
    export const LOGIN = "login";
    export const REGISTER = "register";

    export type NameType = typeof LOGIN | typeof REGISTER;
}

interface ModalWindowState {
    visible: boolean,
    name: ModalWindowName.NameType
}

interface State {
    user: UserState
    modalWindow: ModalWindowState
}

let initialState: State = {
    user: {
        data: undefined
    },
    modalWindow: {
        visible: false,
        name: ModalWindowName.LOGIN,
    }
}

interface SliceProps<TState> {
    name: string,
    initialState: TState,
    reducers: TReducers
}

interface Slice<TState> {
    name: string,
    reducer: TReducer<TState, any>,
    actions: {[key: string]: ()},
    state: TState
}

function createSlice<TState>(props: SliceProps<TState>): Slice<TState> {
    
}

const reducers: TReducers = {
    user: (state: UserState, action: Action<any>) => {
        console.log(state)
        switch (action.type) {
            case "setData":
                return { data: action.payload }
            case "logout":
                return { data: undefined }
            default:
                return state
        }
    },
    modalWindow: (state: ModalWindowState, action: Action<any>) => {
        console.log(state)
        switch (action.type) {
            case "close":
                return { visible: false, name: state.name };
            case "openLogin":
                return { visible: true, name: ModalWindowName.LOGIN };
            case "openRegister":
                return { visible: true, name: ModalWindowName.REGISTER };
            default:
                return state
        }
    }
}

export let store = new Store(initialState, reducers);
