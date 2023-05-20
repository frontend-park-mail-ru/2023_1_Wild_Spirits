import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";

type FriendState = {
    id: number;
    name: string;
    img: string;
};

interface FriendListState {
    friendSearchQuery: string;
    friends: FriendState[];
    foundUsers: FriendState[];
}

const friendListInitialState: FriendListState = {
    friendSearchQuery: "",
    friends: [],
    foundUsers: [],
};

const friendListSlice = createSlice({
    name: "friendListSlice",
    initialState: friendListInitialState,
    reducers: {
        setFriends: (state: FriendListState, action) => {
            state.friends = action.payload.friends;
            return state;
        },
        setFoundUsers: (state: FriendListState, action) => {
            state.foundUsers = action.payload.users;
            return state;
        },
        setFriendSearchQuery: (state: FriendListState, action) => {
            state.friendSearchQuery = action.payload;
            return state;
        },
        clearFriendSearchQuery: (state: FriendListState) => {
            state.friendSearchQuery = "";
            return state;
        },
        addToFriendsList: (state: FriendListState, action: PayloadAction<FriendState>) => {
            state.friends = [...state.friends, action.payload];
            return state;
        },
    },
});

export const { 
    setFriends, 
    setFoundUsers, 
    setFriendSearchQuery, 
    clearFriendSearchQuery,
    addToFriendsList,
} = friendListSlice.actions;
export default friendListSlice;
