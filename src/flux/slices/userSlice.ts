import { createSlice } from "flux/slice";
import { TFriend, TUser, TUserLight } from "models/User";
import { LoadStatus } from "requests/LoadStatus";

import { router } from "modules/router";
import { PayloadAction } from "flux/action";
import { create } from "handlebars";

interface TUserLightDataType extends TUserLight {
    friends?: TFriend[];
}

type FriendState = {
    id: number;
    name: string;
    img: string;
}

interface UserState {
    authorizedLoadStatus: LoadStatus.Type;
    data?: TUserLightDataType;
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
        authorizedLoadStart: (state: UserState) => {
            state.authorizedLoadStatus = LoadStatus.LOADING;
            return state;
        },
        authorizedLoadError: (state: UserState) => {
            state.authorizedLoadStatus = LoadStatus.ERROR;
            return state;
        },
        setData: (state: UserState, action: PayloadAction<TUserLightDataType | undefined>) => {
            state.authorizedLoadStatus = LoadStatus.DONE;
            state.data = action.payload;
            return state;
        },
        addToFriends: (state: UserState) => {
            const currentProfile = state.currentProfile;
            if (currentProfile && state.data) {
                state.data?.friends?.push({
                    id: currentProfile.id,
                    name: currentProfile.name,
                    img: currentProfile.img
                });
                if (state.currentProfile) {
                    state.currentProfile.is_friend = true;
                }
            }
            return state;
        },
        logout: (state: UserState) => {
            state.data = undefined;
            return state;
        },
        setCurrentProfile: (
            state: UserState,
            action: PayloadAction<{ id: number; profile: { user: TUser; friends?: TFriend[] | undefined } }>
        ) => {
            if (action.payload) {
                const profile = action.payload.profile.user;
                const friends = action.payload.profile.friends || state.currentProfile?.friends;

                state.currentProfile = {
                    ...state.currentProfile,
                    ...profile,
                    friendsPreview: friends,
                    id: action.payload.id,
                };
            }
            return state;
        },
        setCurrentProfileFriends: (state: UserState, action: PayloadAction<{ friends: TFriend[] }>) => {
            if (action.payload) {
                if (state.currentProfile) {
                    state.currentProfile.friends = action.payload.friends;
                } else {
                    state.currentProfile = { id: 0, name: "", img: "", friends: action.payload.friends };
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

export const isAuthorized = (state: UserState) =>
    state.authorizedLoadStatus === LoadStatus.DONE && state.data !== undefined;

export const kickUnauthorized = (userState: UserState) => {
    if (
        (userState.authorizedLoadStatus === LoadStatus.DONE || userState.authorizedLoadStatus === LoadStatus.ERROR) &&
        userState.data === undefined
    ) {
        router.go("/");
        return true;
    }
    return false;
};

export const {
    authorizedLoadStart,
    authorizedLoadError,
    setData,
    addToFriends,
    logout,
    setCurrentProfile,
    setCurrentProfileFriends,
    setFriendsPreview,
} = userSlice.actions;

export default userSlice;
