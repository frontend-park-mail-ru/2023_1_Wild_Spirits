import { createSlice } from "flux/slice";
import { TFriend, TUser, TUserLight } from "models/User";
import { LoadStatus } from "requests/LoadStatus";

import { router } from "modules/router";
import { PayloadAction } from "flux/action";

interface TUserLightDataType extends TUserLight {
    friends?: TFriend[];
}

interface UserState {
    authorizedLoadStatus: LoadStatus.Type;
    data?: TUserLightDataType;
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
                const friends = action.payload.profile.friends || state.current_profile?.friends;

                state.current_profile = {
                    ...state.current_profile,
                    ...profile,
                    friends: friends,
                    id: action.payload.id,
                };
            }
            return state;
        },
        setCurrentProfileFriends: (state: UserState, action: PayloadAction<{ friends: TFriend[] }>) => {
            if (action.payload) {
                if (state.current_profile) {
                    state.current_profile.friends = action.payload.friends;
                } else {
                    state.current_profile = { id: 0, name: "", img: "", friends: action.payload.friends };
                }
            }
            return state;
        },
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
    logout,
    setCurrentProfile,
    setCurrentProfileFriends,
} = userSlice.actions;

export default userSlice;
