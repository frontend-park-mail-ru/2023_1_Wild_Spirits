import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";

import { EventProcessingForm, EventProcessingType, SelectedEventData, TEvent, TEventPlace } from "models/Events";
import { TEventLight } from "models/Events";
import { LoadStatus } from "requests/LoadStatus";
import { TagsState } from "./tagsSlice";
import { getUploadsImg } from "modules/getUploadsImg";
import { dateFromServer } from "modules/dateParser";

interface EventProcessingPayload {
    processingState: EventProcessingType.Type;
    event: TEvent;
    places?: TEventPlace[];
    tags: TagsState;
}

export type EventProcessingErrorsType = { [key in keyof EventProcessingForm | "default"]?: string };

export interface EventProcessingData {
    processingState: EventProcessingType.Type;
    formData: EventProcessingForm;
    tags: TagsState;
    errors: EventProcessingErrorsType;
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
            const placeId = places && places.length > 0 ? places[0].id : -1;
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
                    place: placeId,
                    img: getUploadsImg(event.img),
                },
                tags: tags,
                errors: {},
            };
            return state;
        },
        setEventProcessingErrors: (state: EventsState, action: PayloadAction<EventProcessingErrorsType>) => {
            if (state.processing.loadStatus === LoadStatus.DONE) {
                state.processing.errors = action.payload;
            }
            return state;
        },
        setEventProcessingFormDataField: <KEY extends keyof EventProcessingForm>(
            state: EventsState,
            action: PayloadAction<FormField<EventProcessingForm, KEY>>
        ) => {
            if (state.processing.loadStatus === LoadStatus.DONE) {
                state.processing.formData[action.payload.field] = action.payload.value;
                delete state.processing.errors[action.payload.field];
            }
            return state;
        },
        setEventProcessingFormImg: (state: EventsState, action: PayloadAction<string>) => {
            if (state.processing.loadStatus === LoadStatus.DONE) {
                state.processing.tempFileUrl = action.payload;
                delete state.processing.errors.img;
            }

            return state;
        },
        toggleEventProcessingTag: (state: EventsState, action: PayloadAction<string>) => {
            if (state.processing.loadStatus === LoadStatus.DONE) {
                const tag = state.processing.tags.tags[action.payload];
                if (tag !== undefined) {
                    state.processing.tags.tags[action.payload].selected = !tag.selected;
                    // state.processing.errors = {};
                }
            }
            return state;
        },
        setEventProcessingLoadError: (state: EventsState) => {
            state.processing = { loadStatus: LoadStatus.ERROR };
            return state;
        },
        likeEvent: (state: EventsState, action: PayloadAction<{eventId: number}>) => {
            if (state.cards.loadStatus === LoadStatus.DONE) {
                const id = state.cards.data.findIndex(event => event.id === action.payload.eventId);

                if (state.cards.data[id] && !state.cards.data[id].liked) {
                    state.cards.data[id].likes++;
                    state.cards.data[id].liked = true;
                }
            }

            if (state.selectedEvent.loadStatus === LoadStatus.DONE &&
                action.payload.eventId === state.selectedEvent.event.id &&
                !state.selectedEvent.event.liked) {
                    state.selectedEvent.event.likes++;
                    state.selectedEvent.event.liked = true;
                }

            return state;
        },
        dislikeEvent: (state: EventsState, action: PayloadAction<{eventId: number}>) => {
            if (state.cards.loadStatus === LoadStatus.DONE) {
                const id = state.cards.data.findIndex(event => event.id === action.payload.eventId);

                if (state.cards.data[id] && state.cards.data[id].liked) {
                    state.cards.data[id].likes--;
                    state.cards.data[id].liked = false;
                }
            }

            if (state.selectedEvent.loadStatus === LoadStatus.DONE &&
                action.payload.eventId === state.selectedEvent.event.id &&
                state.selectedEvent.event.liked) {
                    state.selectedEvent.event.likes--;
                    state.selectedEvent.event.liked = false;
                }

            return state;
        },
        featureEvent: (state: EventsState, action: PayloadAction<{eventId: number}>) => {
            if (state.cards.loadStatus === LoadStatus.DONE) {
                const id = state.cards.data.findIndex(event => event.id === action.payload.eventId);

                if (state.cards.data[id] && !state.cards.data[id].reminded) {
                    state.cards.data[id].reminded = true;
                }
            }

            if (state.selectedEvent.loadStatus === LoadStatus.DONE &&
                action.payload.eventId === state.selectedEvent.event.id &&
                !state.selectedEvent.event.reminded) {
                    state.selectedEvent.event.reminded = true;
                }

            return state;
        },
        unfeatureEvent: (state: EventsState, action: PayloadAction<{eventId: number}>) => {
            if (state.cards.loadStatus === LoadStatus.DONE) {
                const id = state.cards.data.findIndex(event => event.id === action.payload.eventId);

                if (state.cards.data[id] && !state.cards.data[id].reminded) {
                    state.cards.data[id].reminded = false;
                }
            }

            if (state.selectedEvent.loadStatus === LoadStatus.DONE &&
                action.payload.eventId === state.selectedEvent.event.id &&
                !state.selectedEvent.event.reminded) {
                    state.selectedEvent.event.reminded = false;
                }

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
    setEventProcessingErrors,
    setEventProcessingFormDataField,
    setEventProcessingFormImg,
    toggleEventProcessingTag,
    setEventProcessingLoadError,
    likeEvent,
    dislikeEvent,
    featureEvent,
    unfeatureEvent,
} = eventsSlice.actions;
export default eventsSlice;
