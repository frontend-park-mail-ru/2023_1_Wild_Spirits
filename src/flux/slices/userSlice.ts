import { createSlice } from "flux/slice";

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
        email: string | undefined;
        city_name: string;
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
            console.log("setting data:", action.payload)
            return { data: action.payload };
        },
        logout: (state) => {
            return { data: undefined };
        },
        setCurrentProfile: (state, action) => {
            state.current_profile = action.payload.profile;
            return state;
        }
    },
});

export const { setData, logout, setCurrentProfile } = userSlice.actions;

export default userSlice;
