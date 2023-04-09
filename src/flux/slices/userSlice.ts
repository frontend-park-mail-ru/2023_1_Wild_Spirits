import { createSlice } from "flux/slice";
import { TUser, TUserLight } from "models/User";

import { Action } from "flux/action";

interface UserState {
    data?: {
        id: number;
        name: string;
        img: string;
        city_name: string;

        friends?: {
            id: number,
            name: string,
            img: string
        }[];
    },
    current_profile?: {
        id: number;
        name: string;
        img: string;
        email?: string;
        city_name?: string;
        is_friend?: boolean;

        friends?: {
            id: number,
            name: string,
            img: string
        }[];
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
            if (action.payload) {
                state.data = {...state.data, ...(action.payload)};
            }
            return state;
        },
        logout: (state) => {
            state.data = undefined;
            return state;
        },
        setCurrentProfile: (state: UserState, action: Action<{profile: TUser, id: number}>) => {
            if (action.payload) {
                state.current_profile = {...state.current_profile, ...(action.payload.profile), id: action.payload.id}
            }
            return state;
        },
        setCurrentProfileFriends: (state: UserState, action) => {
            if (action.payload) {
                if (state.current_profile) {
                    state.current_profile.friends = action.payload.friends;
                } else {
                    state.current_profile = {id: 0, name: "", img: "", friends: action.payload.frineds};
                }
            }
            return state;
        }
    },
});

export const { setData, logout, setCurrentProfile, setCurrentProfileFriends } = userSlice.actions;

export default userSlice;
