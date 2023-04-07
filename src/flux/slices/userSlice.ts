import { createSlice } from "flux/slice";

interface UserState {
    data?: {
        id: number;
        name: string;
        img: string;
    };
}

const userInitialState: UserState = {
    data: undefined,
};

const userSlice = createSlice({
    name: "user",
    initialState: userInitialState,
    reducers: {
        setData: (state, action) => {
            return { data: action.payload };
        },
        logout: (state) => {
            return { data: undefined };
        },
    },
});

export const { setData, logout } = userSlice.actions;

export default userSlice;
