import { createSlice } from "flux/slice";

import { TEvent } from "models/Events"
import { TEventLight } from "models/Events";

interface EventsState {
    events: TEventLight[] | undefined,
    selectedEvent: TEvent | undefined
}

const initialState: EventsState = {
    events: undefined,
    selectedEvent: undefined
}

const eventsSlice = createSlice({
    name: "events",
    initialState: initialState,
    reducers: {
        setEvents: (state, action) => {
            state.events = action.payload.events;
            return state;
        },
        selectEvent: (state, action) => {
            state.selectedEvent = action.payload.event;
            return state;
        }
    }
});

export const { setEvents, selectEvent } = eventsSlice.actions;
export default eventsSlice;
