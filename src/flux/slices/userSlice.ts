import { createSlice } from "flux/slice";
import { TFriend, TUser, TUserLight } from "models/User";
import { LoadStatus } from "requests/LoadStatus";

import { router } from "modules/router";
import { PayloadAction } from "flux/action";
import { create } from "handlebars";

interface TUserLightDataType extends TUserLight {
    friends?: TFriend[];
    organizer_id?: number
}

type FriendState = {
    id: number;
    name: string;
    img: string;
}

export interface CurrentProfileState {
    id: number;
    name: string;
    img: string;
    email?: string;
    city_name?: string;
    is_friend?: boolean;

    phone?: string;
    website?: string;
    org_id?: number;

    friendsPreview?: FriendState[];
    friends?: FriendState[];
}

interface UserState {
    authorizedLoadStatus: LoadStatus.Type;
    data?: TUserLightDataType;
    currentProfile?: CurrentProfileState;
}

const userInitialState: UserState = {
    authorizedLoadStatus: LoadStatus.NONE,
    data: undefined,
    currentProfile: undefined,
};

interface TOrganizer extends TUser {
    organizer_id?: number,
    phone?: string,
    website?: string
}

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
        setUserData: (state: UserState, action: PayloadAction<TUserLightDataType | undefined>) => {
            state.authorizedLoadStatus = LoadStatus.DONE;
            state.data = action.payload;
            return state;
        },
        addToFriends: (state: UserState) => {
            const currentProfile = state.currentProfile;
            if (currentProfile && state.data) {
                state.data.friends?.push({
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
        removeFromFriends: (state: UserState) => {
            const currentProfile = state.currentProfile;
            if (currentProfile && state.data && state.data.friends) {
                state.data.friends = state.data.friends.filter(user => user.id !== currentProfile.id);
            }

            if (state.currentProfile) {
                state.currentProfile.is_friend = false;
            }

            return state;
        },
        logout: (state: UserState) => {
            state.data = undefined;
            return state;
        },
        setCurrentProfile: (
            state: UserState,
            action: PayloadAction<{ id: number; profile: { user: TOrganizer, friends?: TFriend[] | undefined } }>
        ) => {
            if (action.payload) {
                const profile = action.payload.profile.user;
                const friends = action.payload.profile.friends;

                state.currentProfile = {
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

export const mineProfile = (userState: UserState) => {
    if (userState.data === undefined) {
        return false;
    }
    if (userState.currentProfile === undefined) {
        return false;
    }

    return userState.data.id === userState.currentProfile.id;
}

export const isOrganizer = (userState: UserState) => {
    return userState.currentProfile?.phone !== undefined;
}

export const {
    authorizedLoadStart,
    authorizedLoadError,
    setUserData,
    addToFriends,
    removeFromFriends,
    logout,
    setCurrentProfile,
    setCurrentProfileFriends,
    setFriendsPreview,
} = userSlice.actions;

export default userSlice;
