import { createSlice } from "flux/slice";
import { TUser } from "models/User";

import { Action } from "flux/action";

interface UserState {
    data?: {
        id: number;
        name: string;
        img: string;
        city_name: string;
    },
    current_profile?: {
        id: number;
        name: string;
        img: string;
        email?: string;
        city_name?: string;
    }
}

const userInitialState: UserState = {
    data: undefined,
    current_profile: undefined
};

const userSlice = createSlice({
    name: "user",
    initialState: userInitialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
            return state;
        },
        logout: (state) => {
            state.data = undefined;
            return state;
        },
        setCurrentProfile: (state: UserState, action: Action<{profile: TUser, id: number}>) => {
            if (action.payload) {
                state.current_profile = {...(action.payload.profile), id: action.payload.id}
            }
            return state;
        }
    },
});

export const { setData, logout, setCurrentProfile } = userSlice.actions;

export default userSlice;
