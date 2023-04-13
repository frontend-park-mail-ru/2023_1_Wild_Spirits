import { createSlice } from "flux/slice";
import { TUser, TUserLight } from "models/User";

import { Action } from "flux/action";
import { LoadStatus } from "requests/LoadStatus";

interface UserState {
    authorizedLoadStatus: LoadStatus.Type;
    data?: {
        id: number;
        name: string;
        img: string;
        city_name: string;

        friends?: {
            id: number;
            name: string;
            img: string;
        }[];
    };
    current_profile?: {
        id: number;
        name: string;
        img: string;
        email?: string;
        city_name?: string;
        is_friend?: boolean;

        friends?: {
            id: number;
            name: string;
            img: string;
        }[];
    };
}

const userInitialState: UserState = {
    authorizedLoadStatus: LoadStatus.NONE,
    data: undefined,
    current_profile: undefined,
};

const userSlice = createSlice({
    name: "user",
    initialState: userInitialState,
    reducers: {
        authorizedLoadStart: (state, action) => {
            state.authorizedLoadStatus = LoadStatus.LOADING;
            return state;
        },
        authorizedLoadError: (state, action) => {
            state.authorizedLoadStatus = LoadStatus.ERROR;
            return state;
        },
        setData: (state, action) => {
            state.authorizedLoadStatus = LoadStatus.DONE;
            if (action.payload) {
                state.data = { ...state.data, ...action.payload };
            }
            return state;
        },
        logout: (state) => {
            state.data = undefined;
            return state;
        },
        setCurrentProfile: (state: UserState, action) => {
            if (action.payload) {
                const profile = action.payload.profile.user;
                const friends = action.payload.profile.friends || state.current_profile?.friends;

                state.current_profile = { ...state.current_profile, 
                                          ...profile, 
                                          friends: friends,
                                          id: action.payload.id };
            }
            return state;
        },
        setCurrentProfileFriends: (state: UserState, action) => {
            if (action.payload) {
                if (state.current_profile) {
                    state.current_profile.friends = action.payload.friends;
                } else {
                    state.current_profile = { id: 0, name: "", img: "", friends: action.payload.frineds };
                }
            }
            return state;
        },
    },
});

export const {
    authorizedLoadStart,
    authorizedLoadError,
    setData,
    logout,
    setCurrentProfile,
    setCurrentProfileFriends,
} = userSlice.actions;

export default userSlice;
