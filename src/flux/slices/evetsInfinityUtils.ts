import { PayloadAction } from "flux/action";
import { EventsState, EventsStateCards, EventsStateCardsInfinity } from "./eventSlice";
import { TEventLight } from "models/Events";
import { LoadStatus } from "requests/LoadStatus";

export const setLoadStart = (state: EventsState, fieldName: keyof EventsStateCards) => {
    state[fieldName] = { loadStatus: LoadStatus.LOADING };
    return state;
};

export const setData = (
    state: EventsState,
    action: PayloadAction<TEventLight[]>,
    fieldName: keyof EventsStateCards
) => {
    state[fieldName] = { loadStatus: LoadStatus.DONE, data: action.payload };
    return state;
};

export const CreateIninityCardsReducers = (
    name: string,
    fieldName: keyof EventsStateCards,
    infinityFieldName: keyof EventsStateCardsInfinity
) => {
    return {
        [name]: (state: EventsState) => {
            state[fieldName] = { loadStatus: LoadStatus.LOADING };
            return state;
        },
        setEventsCards: (state: EventsState, action: PayloadAction<TEventLight[]>) => {
            state[fieldName] = { loadStatus: LoadStatus.DONE, data: action.payload };
            return state;
        },
        setEventsCardsLoadError: (state: EventsState) => {
            state[fieldName] = { loadStatus: LoadStatus.ERROR };
            return state;
        },
        resetEventsCards: (state: EventsState) => {
            state[fieldName] = { loadStatus: LoadStatus.NONE };
            state[infinityFieldName] = { status: LoadStatus.NONE, pageNumber: 1, isEnd: false };

            return state;
        },
        setEventsCardsInfinityLoadStart: (state: EventsState) => {
            state[infinityFieldName].status = LoadStatus.LOADING;
            return state;
        },
        addEventsCardsInfinity: (state: EventsState, action: PayloadAction<TEventLight[]>) => {
            const stateCard = state[fieldName];
            if (stateCard.loadStatus === LoadStatus.DONE) {
                if (action.payload.length === 0) {
                    state[infinityFieldName].isEnd = true;
                    state[infinityFieldName].status = LoadStatus.DONE;

                    return state;
                }

                state[infinityFieldName].status = LoadStatus.DONE;
                state[infinityFieldName].pageNumber++;

                stateCard.data = stateCard.data.concat(action.payload);
            }
            return state;
        },
        setEventsCardsInfinityLoadError: (state: EventsState) => {
            state[infinityFieldName].status = LoadStatus.ERROR;
            return state;
        },
    };
};
