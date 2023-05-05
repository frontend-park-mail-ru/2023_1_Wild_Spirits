import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";
import { TEventPlace } from "models/Events";
import { LoadStatus } from "requests/LoadStatus";

export interface PlacesState {
    places: LoadStatus.DataDoneOrNotDone<{ data: TEventPlace[] }>;
}

const initialState: PlacesState = {
    places: { loadStatus: LoadStatus.NONE },
};

const placesSlice = createSlice({
    name: "places",
    initialState: initialState,
    reducers: {
        setPlacesLoadStart: (state: PlacesState) => {
            state.places.loadStatus = LoadStatus.LOADING;
            return state;
        },
        setPlaces: (state: PlacesState, action: PayloadAction<TEventPlace[]>) => {
            state.places = { loadStatus: LoadStatus.DONE, data: action.payload };
            return state;
        },
        setPlacesLoadError: (state: PlacesState) => {
            state.places.loadStatus = LoadStatus.ERROR;
            return state;
        },
    },
});

export const { setPlacesLoadStart, setPlaces, setPlacesLoadError } = placesSlice.actions;
export default placesSlice;
