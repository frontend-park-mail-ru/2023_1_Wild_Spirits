import { createSlice } from "flux/slice";

import { TEvent } from "models/Events"
import { EventCard } from "components/Events/EventCard/EventCard";

interface EventsState {
    eventCards: EventCard[] | undefined,
    selectedEvent: TEvent | undefined
}

const initialState: EventsState = {
    eventCards: undefined,
    selectedEvent: undefined
}

const eventsSlice = createSlice({
    name: "events",
    initialState: initialState,
    reducers: {
        setEvents: (state, action) => {
            state.eventCards = action.payload.events;
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
