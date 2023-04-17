import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";

import { TEvent } from "models/Events";
import { TEventLight } from "models/Events";
import { LoadStatus } from "requests/LoadStatus";

interface EventsState {
    eventsLoadStatus: LoadStatus.Type;
    events: TEventLight[] | undefined;
    selectedEvent: TEvent | undefined;
}

const initialState: EventsState = {
    eventsLoadStatus: LoadStatus.NONE,
    events: undefined,
    selectedEvent: undefined,
};

const eventsSlice = createSlice({
    name: "events",
    initialState: initialState,
    reducers: {
        setEventsLoadStart: (state: EventsState) => {
            state.eventsLoadStatus = LoadStatus.LOADING;
            return state;
        },
        setEvents: (state: EventsState, action: PayloadAction<{ events: TEventLight[] | undefined }>) => {
            state.eventsLoadStatus = LoadStatus.DONE;
            state.events = action.payload.events;
            return state;
        },
        selectEvent: (state: EventsState, action: PayloadAction<{ event: TEvent | undefined }>) => {
            state.selectedEvent = action.payload.event;
            return state;
        },
    },
});

export const { setEventsLoadStart, setEvents, selectEvent } = eventsSlice.actions;
export default eventsSlice;
