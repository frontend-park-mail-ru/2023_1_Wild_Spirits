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

export const setLoadError = (state: EventsState, fieldName: keyof EventsStateCards) => {
    state[fieldName] = { loadStatus: LoadStatus.ERROR };
    return state;
};

export const resetAll = (
    state: EventsState,
    fieldName: keyof EventsStateCards,
    infFieldName: keyof EventsStateCardsInfinity
) => {
    state[fieldName] = { loadStatus: LoadStatus.NONE };
    state[infFieldName] = { status: LoadStatus.NONE, pageNumber: 1, isEnd: false };

    return state;
};

export const setInfLoadStart = (state: EventsState, infFieldName: keyof EventsStateCardsInfinity) => {
    state[infFieldName].status = LoadStatus.LOADING;
    return state;
};

export const addInf = (
    state: EventsState,
    action: PayloadAction<TEventLight[]>,
    fieldName: keyof EventsStateCards,
    infFieldName: keyof EventsStateCardsInfinity
) => {
    const stateCard = state[fieldName];
    if (stateCard.loadStatus === LoadStatus.DONE) {
        if (action.payload.length === 0) {
            state[infFieldName].isEnd = true;
            state[infFieldName].status = LoadStatus.DONE;

            return state;
        }

        state[infFieldName].status = LoadStatus.DONE;
        state[infFieldName].pageNumber++;

        stateCard.data = stateCard.data.concat(action.payload);
    }
    return state;
};

export const setInfLoadError = (state: EventsState, infFieldName: keyof EventsStateCardsInfinity) => {
    state[infFieldName].status = LoadStatus.ERROR;
    return state;
};
