import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";

import { EventProcessingForm, EventProcessingState, SelectedEventData, TEvent, TEventPlace } from "models/Events";
import { TEventLight } from "models/Events";
import { LoadStatus } from "requests/LoadStatus";
import { TagsState } from "./tagsSlice";
import { getUploadsImg } from "modules/getUploadsImg";
import { dateFromServer } from "modules/dateParser";

interface EventProcessingPayload {
    processingState: EventProcessingState.Type;
    event: TEvent;
    places?: TEventPlace[];
    tags: TagsState;
}

interface EventProcessingData {
    processingState: EventProcessingState.Type;
    formData: EventProcessingForm;
    tags: TagsState;
    tempFileUrl?: string;
}

interface EventsState {
    cards: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
    selectedEvent: LoadStatus.DataDoneOrNotDone<SelectedEventData>;
    processing: LoadStatus.DataDoneOrNotDone<EventProcessingData>;
}

const initialState: EventsState = {
    cards: { loadStatus: LoadStatus.NONE },
    selectedEvent: { loadStatus: LoadStatus.NONE },
    processing: { loadStatus: LoadStatus.NONE },
};

interface FormField<T, K extends keyof T> {
    field: K;
    value: T[K];
}

const eventsSlice = createSlice({
    name: "events",
    initialState: initialState,
    reducers: {
        setEventsCardsLoadStart: (state: EventsState) => {
            state.cards = { loadStatus: LoadStatus.LOADING };
            return state;
        },
        setEventsCards: (state: EventsState, action: PayloadAction<TEventLight[]>) => {
            state.cards = { loadStatus: LoadStatus.DONE, data: action.payload };
            return state;
        },
        setEventsCardsLoadError: (state: EventsState) => {
            state.cards = { loadStatus: LoadStatus.ERROR };
            return state;
        },
        setSelectedEventLoadStart: (state: EventsState) => {
            state.selectedEvent = { loadStatus: LoadStatus.LOADING };
            return state;
        },
        setSelectedEvent: (state: EventsState, action: PayloadAction<SelectedEventData>) => {
            state.selectedEvent = { loadStatus: LoadStatus.DONE, ...action.payload };
            return state;
        },
        setSelectedEventLoadError: (state: EventsState) => {
            state.selectedEvent = { loadStatus: LoadStatus.ERROR };
            return state;
        },
        setEventProcessingLoadStart: (state: EventsState) => {
            state.processing.loadStatus = LoadStatus.LOADING;
            return state;
        },
        setEventProcessingFormData: (state: EventsState, action: PayloadAction<EventProcessingPayload>) => {
            const { event, places, tags, processingState } = action.payload;
            state.processing = {
                loadStatus: LoadStatus.DONE,
                processingState,
                formData: {
                    id: event.id,
                    name: event.name,
                    description: event.description,
                    dateStart: dateFromServer(event.dates.dateStart),
                    dateEnd: dateFromServer(event.dates.dateEnd),
                    timeStart: event.dates.timeStart,
                    timeEnd: event.dates.timeEnd,
                    place: "ВДНХ",
                    img: getUploadsImg(event.img),
                },
                tags: tags,
            };
            return state;
        },
        setEventProcessingFormDataField: <KEY extends keyof EventProcessingForm>(
            state: EventsState,
            action: PayloadAction<FormField<EventProcessingForm, KEY>>
        ) => {
            if (state.processing.loadStatus === LoadStatus.DONE) {
                state.processing.formData[action.payload.field] = action.payload.value;
            }
            return state;
        },
        setEventProcessingFormImg: (state: EventsState, action: PayloadAction<string>) => {
            if (state.processing.loadStatus === LoadStatus.DONE) {
                state.processing.tempFileUrl = action.payload;
            }

            return state;
        },

        toggleEventProcessingTag: (state: EventsState, action: PayloadAction<string>) => {
            if (state.processing.loadStatus === LoadStatus.DONE) {
                const tag = state.processing.tags.tags[action.payload];
                if (tag !== undefined) {
                    state.processing.tags.tags[action.payload].selected = !tag.selected;
                }
            }
            return state;
        },
        setEventProcessingTempFileUrl: (state: EventsState, action: PayloadAction<string>) => {
            if (state.processing.loadStatus === LoadStatus.DONE) {
                state.processing.tempFileUrl = action.payload;
            }
            return state;
        },
        setEventProcessingLoadError: (state: EventsState) => {
            state.processing = { loadStatus: LoadStatus.ERROR };
            return state;
        },
    },
});

export const {
    setEventsCardsLoadStart,
    setEventsCards,
    setEventsCardsLoadError,
    setSelectedEventLoadStart,
    setSelectedEvent,
    setSelectedEventLoadError,
    setEventProcessingLoadStart,
    setEventProcessingFormData,
    setEventProcessingFormDataField,
    setEventProcessingFormImg,
    toggleEventProcessingTag,
    setEventProcessingTempFileUrl,
    setEventProcessingLoadError,
} = eventsSlice.actions;
export default eventsSlice;
