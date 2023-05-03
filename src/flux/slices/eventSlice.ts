import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";

import {
    EventProcessingForm,
    EventProcessingType,
    SelectedEventData,
    TEvent,
    TEventMap,
    TEventPlace,
} from "models/Events";
import { TEventLight } from "models/Events";
import { LoadStatus } from "requests/LoadStatus";
import { StateTagsType } from "./tagsSlice";
import { getUploadsImg } from "modules/getUploadsImg";
import { dateFromServer } from "modules/dateParser";
import { store } from "flux";
import { mineProfile } from "./userSlice";

interface EventProcessingPayload {
    processingState: EventProcessingType.Type;
    event: TEvent;
    places?: TEventPlace[];
    tags: StateTagsType;
}

export type EventProcessingErrorsType = { [key in keyof EventProcessingForm | "default"]?: string };

export interface EventProcessingData {
    processingState: EventProcessingType.Type;
    formData: EventProcessingForm;
    tags: StateTagsType;
    errors: EventProcessingErrorsType;
    tempFileUrl?: string;
}

export interface EventsStateCards {
    cards: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
    likedEvents: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
    plannedEvents: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
    subbedEvents: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
    orgEvents: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
}
const subSlices: (keyof EventsStateCards)[] = ["cards", "likedEvents", "plannedEvents", "subbedEvents", "orgEvents"];

export interface EventsState extends EventsStateCards {
    selectedEvent: LoadStatus.DataDoneOrNotDone<SelectedEventData>;
    processing: LoadStatus.DataDoneOrNotDone<EventProcessingData>;
    mapEvents: TEventMap[];
}

const initialState: EventsState = {
    cards: { loadStatus: LoadStatus.NONE },
    selectedEvent: { loadStatus: LoadStatus.NONE },
    processing: { loadStatus: LoadStatus.NONE },
    mapEvents: [],
    orgEvents: { loadStatus: LoadStatus.NONE },
    likedEvents: { loadStatus: LoadStatus.NONE },
    plannedEvents: { loadStatus: LoadStatus.NONE },
    subbedEvents: { loadStatus: LoadStatus.NONE },
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
                    place: places && places.length > 0 ? places[0].name : "",
                    category: event.categories && event.categories.length > 0 ? event.categories[0] : "",
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
        setMapEvents: (state: EventsState, action: PayloadAction<TEventMap[]>) => {
            state.mapEvents = action.payload;
            return state;
        },
        toggleEventProcessingTag: (state: EventsState, action: PayloadAction<string>) => {
            if (state.processing.loadStatus === LoadStatus.DONE) {
                const tag = state.processing.tags[action.payload];
                if (tag !== undefined) {
                    state.processing.tags[action.payload].selected = !tag.selected;
                    // state.processing.errors = {};
                }
            }
            return state;
        },
        setEventProcessingLoadError: (state: EventsState) => {
            state.processing = { loadStatus: LoadStatus.ERROR };
            return state;
        },
        likeEvent: (state: EventsState, action: PayloadAction<{ eventId: number }>) => {
            let likedEvent: TEventLight | undefined = undefined;
            const like = (subSlice: keyof EventsStateCards) => {
                let subState = state[subSlice];
                if (subState.loadStatus === LoadStatus.DONE) {
                    const id = subState.data.findIndex((event) => event.id === action.payload.eventId);

                    if (subState.data[id] && !subState.data[id].liked) {
                        if (likedEvent === undefined) {
                            likedEvent = subState.data[id];
                        }

                        subState.data[id].likes++;
                        subState.data[id].liked = true;
                    }
                }
            };
            subSlices.forEach((subSlice) => like(subSlice));

            if (
                state.likedEvents.loadStatus === LoadStatus.DONE &&
                likedEvent !== undefined &&
                mineProfile(store.state.user)
            ) {
                state.likedEvents.data.push(likedEvent);
            }

            if (
                state.selectedEvent.loadStatus === LoadStatus.DONE &&
                action.payload.eventId === state.selectedEvent.event.id &&
                !state.selectedEvent.event.liked
            ) {
                state.selectedEvent.event.likes++;
                state.selectedEvent.event.liked = true;
            }

            return state;
        },
        dislikeEvent: (state: EventsState, action: PayloadAction<{ eventId: number }>) => {
            const dislike = (subSlice: keyof EventsStateCards) => {
                let subState = state[subSlice];
                if (subState.loadStatus === LoadStatus.DONE) {
                    const id = subState.data.findIndex((event) => event.id === action.payload.eventId);

                    if (subState.data[id] && subState.data[id].liked) {
                        subState.data[id].likes--;
                        subState.data[id].liked = false;
                    }
                }
            };

            subSlices.forEach((subSlice) => dislike(subSlice));

            if (state.likedEvents.loadStatus === LoadStatus.DONE && mineProfile(store.state.user)) {
                state.likedEvents.data = state.likedEvents.data.filter((event) => event.id !== action.payload.eventId);
            }

            if (
                state.selectedEvent.loadStatus === LoadStatus.DONE &&
                action.payload.eventId === state.selectedEvent.event.id &&
                state.selectedEvent.event.liked
            ) {
                state.selectedEvent.event.likes--;
                state.selectedEvent.event.liked = false;
            }

            return state;
        },
        featureEvent: (state: EventsState, action: PayloadAction<{ eventId: number }>) => {
            let featuredEvent: TEventLight | undefined = undefined;
            const feature = (subSlice: keyof EventsStateCards) => {
                let subState = state[subSlice];
                if (subState.loadStatus === LoadStatus.DONE) {
                    const id = subState.data.findIndex((event) => event.id === action.payload.eventId);

                    if (subState.data[id] && !subState.data[id].reminded) {
                        if (featuredEvent === undefined) {
                            featuredEvent = subState.data[id];
                        }
                        subState.data[id].reminded = true;
                    }
                }
            };

            subSlices.forEach((subSlice) => feature(subSlice));

            if (
                state.plannedEvents.loadStatus === LoadStatus.DONE &&
                featuredEvent !== undefined &&
                mineProfile(store.state.user)
            ) {
                state.plannedEvents.data.push(featuredEvent);
            }

            if (
                state.selectedEvent.loadStatus === LoadStatus.DONE &&
                action.payload.eventId === state.selectedEvent.event.id &&
                !state.selectedEvent.event.reminded
            ) {
                state.selectedEvent.event.reminded = true;
            }

            return state;
        },
        unfeatureEvent: (state: EventsState, action: PayloadAction<{ eventId: number }>) => {
            const unfeature = (subSlice: keyof EventsStateCards) => {
                let subState = state[subSlice];
                if (subState.loadStatus === LoadStatus.DONE) {
                    const id = subState.data.findIndex((event) => event.id === action.payload.eventId);

                    if (subState.data[id] && subState.data[id].reminded) {
                        subState.data[id].reminded = false;
                    }
                }
            };

            subSlices.forEach((subSlice) => unfeature(subSlice));

            if (state.plannedEvents.loadStatus === LoadStatus.DONE && mineProfile(store.state.user)) {
                state.plannedEvents.data = state.plannedEvents.data.filter(
                    (event) => event.id !== action.payload.eventId
                );
            }

            if (
                state.selectedEvent.loadStatus === LoadStatus.DONE &&
                action.payload.eventId === state.selectedEvent.event.id &&
                state.selectedEvent.event.reminded
            ) {
                state.selectedEvent.event.reminded = false;
            }

            return state;
        },
        setOrgEventsLoadStart: (state: EventsState) => {
            state.orgEvents = { loadStatus: LoadStatus.LOADING };
            return state;
        },
        setOrgEvents: (state: EventsState, action: PayloadAction<TEventLight[]>) => {
            state.orgEvents = { loadStatus: LoadStatus.DONE, data: action.payload };
            return state;
        },
        setOrgEventsLoadError: (state: EventsState) => {
            state.orgEvents = { loadStatus: LoadStatus.ERROR };
            return state;
        },

        setLikedEventsLoadStart: (state: EventsState) => {
            state.likedEvents = { loadStatus: LoadStatus.LOADING };
            return state;
        },
        setLikedEvents: (state: EventsState, action: PayloadAction<TEventLight[]>) => {
            state.likedEvents = { loadStatus: LoadStatus.DONE, data: action.payload };
            return state;
        },
        setLikedEventsLoadError: (state: EventsState) => {
            state.likedEvents = { loadStatus: LoadStatus.ERROR };
            return state;
        },

        setPlannedEventsLoadStart: (state: EventsState) => {
            state.plannedEvents = { loadStatus: LoadStatus.LOADING };
            return state;
        },
        setPlannedEvents: (state: EventsState, action: PayloadAction<TEventLight[]>) => {
            state.plannedEvents = { loadStatus: LoadStatus.DONE, data: action.payload };
            return state;
        },
        setPlannedEventsLoadError: (state: EventsState) => {
            state.plannedEvents = { loadStatus: LoadStatus.ERROR };
            return state;
        },

        setSubbedEventsLoadStart: (state: EventsState) => {
            state.plannedEvents = { loadStatus: LoadStatus.LOADING };
            return state;
        },
        setSubbedEvents: (state: EventsState, action: PayloadAction<TEventLight[]>) => {
            state.plannedEvents = { loadStatus: LoadStatus.DONE, data: action.payload };
            return state;
        },
        setSubbedEventsLoadError: (state: EventsState) => {
            state.plannedEvents = { loadStatus: LoadStatus.ERROR };
            return state;
        },
    },
});

export const hasEvents = (events: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>) =>
    events.loadStatus === LoadStatus.DONE && events.data.length > 0;
export const hasNotLoaded = (events: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>) =>
    events.loadStatus === LoadStatus.NONE;

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
    setMapEvents,
    toggleEventProcessingTag,
    setEventProcessingLoadError,
    likeEvent,
    dislikeEvent,
    featureEvent,
    unfeatureEvent,

    setOrgEventsLoadStart,
    setOrgEvents,
    setOrgEventsLoadError,

    setLikedEventsLoadStart,
    setLikedEvents,
    setLikedEventsLoadError,

    setPlannedEventsLoadStart,
    setPlannedEvents,
    setPlannedEventsLoadError,

    setSubbedEventsLoadStart,
    setSubbedEvents,
    setSubbedEventsLoadError,
} = eventsSlice.actions;
export default eventsSlice;
