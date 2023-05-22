import { createSlice } from "flux/slice";
import { TFriend, TUser, TUserLight } from "models/User";
import { LoadStatus } from "requests/LoadStatus";

import { router } from "modules/router";
import { PayloadAction } from "flux/action";

export interface TUserLightDataType extends TUserLight {
    friends?: TFriend[];
    organizer_id?: number;
}

export type FriendState = {
    id: number;
    name: string;
    img: string;
};

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

type AuthorizedWithLoadType = LoadStatus.DataDoneOrNotDone<{ data: TUserLightDataType | undefined }>;

interface UserState {
    authorized: AuthorizedWithLoadType;
    currentProfile?: CurrentProfileState;
}

const userInitialState: UserState = {
    authorized: { loadStatus: LoadStatus.NONE },
    currentProfile: undefined,
};

export interface TOrganizer extends TUser {
    org_id?: number;
    phone?: string;
    website?: string;
}

const userSlice = createSlice({
    name: "user",
    initialState: userInitialState,
    reducers: {
        authorizedLoadStart: (state: UserState) => {
            state.authorized = { loadStatus: LoadStatus.LOADING };
            return state;
        },
        authorizedLoadError: (state: UserState) => {
            state.authorized = { loadStatus: LoadStatus.ERROR };
            return state;
        },
        setAuthorizedData: (state: UserState, action: PayloadAction<TUserLightDataType | undefined>) => {
            state.authorized = {
                loadStatus: LoadStatus.DONE,
                data: action.payload,
            };
            return state;
        },
        addToFriends: (state: UserState,  action: PayloadAction<FriendState>) => {
            const user = action.payload;
            if (state.authorized.loadStatus === LoadStatus.DONE && state.authorized.data) {
                state.authorized.data.friends?.push({
                    ...user,
                    email: "",
                });
                if (state.currentProfile?.id === user.id) {
                    state.currentProfile.is_friend = true;
                } else if (state.currentProfile?.id === state.authorized.data.id) {
                    if (state.currentProfile.friendsPreview) {
                        if (state.currentProfile.friendsPreview.length < 4) {
                            state.currentProfile.friendsPreview = [...state.currentProfile.friendsPreview, user];
                        }
                    } else {
                        state.currentProfile.friendsPreview = [user];
                    }
                }
            }

            return state;
        },
        removeFromFriends: (state: UserState) => {
            const { currentProfile, authorized } = state;
            if (currentProfile && isAuthorizedOrNotDone(authorized) && authorized.data.friends) {
                authorized.data.friends = authorized.data.friends.filter((user) => user.id !== currentProfile.id);
            }

            if (state.currentProfile) {
                state.currentProfile.is_friend = false;
            }

            return state;
        },
        logout: (state: UserState) => {
            state.authorized = { loadStatus: LoadStatus.DONE, data: undefined };
            return state;
        },
        setCurrentProfile: (
            state: UserState,
            action: PayloadAction<{ id: number; profile: { user: TOrganizer; friends?: TFriend[] | undefined } }>
        ) => {
            if (action.payload) {
                const profile = action.payload.profile.user;
                const friends = action.payload.profile.friends;

                // const org_id = profile.org_id || state.currentProfile?.org_id;
                const org_id = profile.org_id;
                state.currentProfile = {
                    ...profile,
                    org_id,
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
            state.currentProfile = {
                id: 0,
                name: "",
                img: "",
                ...state.currentProfile,
                friendsPreview: action.payload,
            };
            return state;
        },
        setOrgId: (state: UserState, action: PayloadAction<{orgId: number}>) => {
            if (state.authorized.loadStatus === LoadStatus.DONE && state.authorized.data) {
                state.authorized.data.organizer_id = action.payload.orgId;
            }
            return state;
        }
    },
});

export const isAuthorizedOrNotDone = (
    authorized: AuthorizedWithLoadType
): authorized is { loadStatus: typeof LoadStatus.DONE; data: TUserLightDataType } => {
    return authorized.loadStatus === LoadStatus.DONE && authorized.data !== undefined;
};

export const isAuthorized = (state: UserState): boolean => {
    return state.authorized.loadStatus === LoadStatus.DONE && state.authorized.data !== undefined;
};

export const kickUnauthorized = (state: UserState) => {
    if (
        (state.authorized.loadStatus === LoadStatus.DONE && state.authorized.data === undefined) ||
        state.authorized.loadStatus === LoadStatus.ERROR
    ) {
        router.go("/");
        return true;
    }
    return false;
};

export const mineProfile = (state: UserState) => {
    if (state.authorized.loadStatus !== LoadStatus.DONE) {
        return false;
    }
    if (state.authorized.data === undefined || state.currentProfile === undefined) {
        return false;
    }

    return state.authorized.data.id === state.currentProfile.id;
};

export const isOrganizer = (state: UserState) => {
    return state.currentProfile?.org_id !== undefined;
};

export const getAuthorizedCity = (state: UserState): string | undefined => {
    const { authorized } = state;
    if (isAuthorizedOrNotDone(authorized)) {
        authorized.data.city_name;
    }
    return undefined;
};

export const {
    authorizedLoadStart,
    setAuthorizedData,
    authorizedLoadError,

    addToFriends,
    removeFromFriends,

    logout,

    setCurrentProfile,
    setCurrentProfileFriends,
    setFriendsPreview,

    setOrgId,
} = userSlice.actions;

export default userSlice;
