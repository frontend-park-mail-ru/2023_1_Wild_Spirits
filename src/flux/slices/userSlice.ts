import { createSlice } from "flux/slice";
import { LoadStatus } from "requests/LoadStatus";

import { router } from "modules/router";

type FriendState = {
    id: number;
    name: string;
    img: string;
}

interface UserState {
    authorizedLoadStatus: LoadStatus.Type;
    data?: {
        id: number;
        name: string;
        img: string;
        city_name: string;

        friends?: FriendState[];
    };
    currentProfile?: {
        id: number;
        name: string;
        img: string;
        email?: string;
        city_name?: string;
        is_friend?: boolean;

        friendsPreview?: FriendState[];

        friends?: FriendState[];
    };
}

const userInitialState: UserState = {
    authorizedLoadStatus: LoadStatus.NONE,
    data: undefined,
    currentProfile: undefined,
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
                const friends = action.payload.profile.friends || state.currentProfile?.friends;

                state.currentProfile = { ...state.currentProfile, 
                                          ...profile, 
                                          friendsPreview: friends,
                                          id: action.payload.id };
            }
            return state;
        },
        setCurrentProfileFriends: (state: UserState, action) => {
            if (action.payload) {
                if (state.currentProfile) {
                    state.currentProfile.friends = action.payload.friends;
                } else {
                    state.currentProfile = { id: 0, name: "", img: "", friends: action.payload.frineds };
                }
            }
            return state;
        },
        setFriendsPreview: (state: UserState, action) => {
            state.currentProfile = {  id: 0, name: "", img: "", ...state.currentProfile, friendsPreview: action.payload }
            return state;
        }
    },
});

export const isAuthorized =  (state: UserState) => state.authorizedLoadStatus === LoadStatus.DONE && 
                                                   state.data !== undefined

export const kickUnauthorized = (userState: UserState) => {
    if (
        (userState.authorizedLoadStatus === LoadStatus.DONE ||
            userState.authorizedLoadStatus === LoadStatus.ERROR) &&
        userState.data === undefined
    ) {
        router.go("/");
        return true;
    }
    return false;
}

export const {
    authorizedLoadStart,
    authorizedLoadError,
    setData,
    logout,
    setCurrentProfile,
    setCurrentProfileFriends,
    setFriendsPreview,
} = userSlice.actions;

export default userSlice;
