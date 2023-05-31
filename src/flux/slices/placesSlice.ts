import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";
import { TEventPlace } from "models/Events";
import { LoadStatus } from "requests/LoadStatus";

export interface PlacesState {
    places: LoadStatus.DataDoneOrNotDone<{ data: TEventPlace[] }>;
    name: string;
    address: string;
    selectedPlace: TEventPlace | undefined;
}

const initialState: PlacesState = {
    places: { loadStatus: LoadStatus.NONE },
    name: "",
    address: "",
    selectedPlace: undefined,
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
        setFilterName: (state: PlacesState, action: PayloadAction<string>) => {
            state.name = action.payload;
            return state;
        },
        setFilterAddress: (state: PlacesState, action: PayloadAction<string>) => {
            state.address = action.payload;
            return state;
        },
        clearFilters: (state: PlacesState) => {
            state.name = "";
            state.address = "";
            return state;
        },
        selectPlace: (state: PlacesState, action: PayloadAction<number | undefined>) => {
            if (state.places.loadStatus === LoadStatus.DONE) {
                state.selectedPlace = state.places.data.find((element) => element.id === action.payload);
            }
            return state;
        },
        setSelectedPlace: (state: PlacesState, action: PayloadAction<TEventPlace | undefined>) => {
            state.selectedPlace = action.payload;
            return state;
        },
    },
});

export const {
    setPlacesLoadStart,
    setPlaces,
    setPlacesLoadError,
    setFilterName,
    setFilterAddress,
    clearFilters,
    selectPlace,
    setSelectedPlace,
} = placesSlice.actions;
export default placesSlice;
