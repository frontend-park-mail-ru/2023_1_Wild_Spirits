import { store } from "flux";
import { TagsState, getSelectedTags } from "flux/slices/tagsSlice";
import { getSelectedCityName } from "flux/slices/headerSlice";
import { getSelectedCategory } from "flux/slices/headerSlice";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseEvent, ResponseEventsLight } from "responses/ResponseEvent";
import {
    setEventProcessingFormData,
    setEventsCards,
    setEventProcessingLoadError,
    setSelectedEvent,
    setSelectedEventLoadError,
} from "flux/slices/eventSlice";
import { UrlPropsType } from "modules/ajax";
import { TRequest, TRequestResolver } from "./requestTypes";
import { EventProcessingState } from "models/Events";

/**
 * fill itself with events from server
 */
export const loadEvents: TRequest = (resolveRequest) => {
    const zeroPad = (num: number, places: number) => String(num).padStart(places, "0");

    const dateToString = (date: Date | undefined) => {
        return date
            ? [zeroPad(date.getDate(), 2), zeroPad(date.getMonth() + 1, 2), zeroPad(date.getFullYear(), 4)].join(".")
            : undefined;
    };

    const filterProps = (props: { [key: string]: string | string[] | undefined }): UrlPropsType => {
        return Object.fromEntries(
            Object.entries(props).filter(([_, value]) => {
                return value !== undefined && value.length > 0;
            })
        ) as UrlPropsType;
    };

    const city = getSelectedCityName(store.getState().header);

    const startDate = store.getState().calendar.startDate;
    const finishDate = store.getState().calendar.finishDate || startDate;

    const props = filterProps({
        tags: getSelectedTags(store.getState().tags),
        cities: city,
        categories: getSelectedCategory(store.getState().header),
        dateStart: dateToString(startDate),
        dateEnd: dateToString(finishDate),
        search: store.getState().header.searchQuery,
    });

    ajax.get<ResponseEventsLight>({
        url: "/events",
        urlProps: props,
    })
        .then(({ json, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(setEventsCards(json.body.events));
            } else {
                store.dispatch(setEventProcessingLoadError());
            }
            resolveRequest();
        })
        .catch(() => {
            store.dispatch(setEventProcessingLoadError());
            resolveRequest();
        });
};

interface LoadEventProps {
    eventId: number;
    onSuccess: (json: ResponseEvent) => void;
    onError: () => void;
    resolveRequest: TRequestResolver;
}

const loadEvent = ({ eventId, onSuccess, onError, resolveRequest }: LoadEventProps) => {
    ajax.get<ResponseEvent>({ url: `/events/${eventId}` })
        .then(({ json, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                onSuccess(json);
            } else {
                onError();
            }
            resolveRequest();
        })
        .catch((error) => {
            onError();
            resolveRequest();
        });
};

export const loadEventPage: TRequest = (resolveRequest, eventId: number) => {
    loadEvent({
        eventId,
        onSuccess: (json) => {
            store.dispatch(setSelectedEvent(json.body));
        },
        onError: () => {
            store.dispatch(setSelectedEventLoadError());
        },
        resolveRequest,
    });
};

const getTags = (tags: string[] | null): TagsState => {
    return {
        tags: Object.fromEntries(
            Object.entries(store.getState().tags.tags).map(([key, value]) => {
                return [
                    key,
                    {
                        id: value.id,
                        selected: tags !== null ? tags.includes(key) : false,
                    },
                ];
            })
        ),
    };
};

export const loadEventProcessingEdit: TRequest = (resolveRequest, eventId: number) => {
    loadEvent({
        eventId,
        onSuccess: (json) => {
            const event = json.body.event;
            const tags: TagsState = getTags(event.tags);
            store.dispatch(
                setEventProcessingFormData({
                    ...json.body,
                    tags: tags,
                    processingState: EventProcessingState.EDIT,
                })
            );
        },
        onError: () => {
            store.dispatch(setEventProcessingLoadError());
        },
        resolveRequest,
    });
};

export const loadEventProcessingCreate: TRequest = (resolveRequest) => {
    store.dispatch(
        setEventProcessingFormData({
            event: {
                id: -1,
                name: "",
                description: "",
                dates: {
                    dateStart: "",
                    dateEnd: "",
                    timeStart: "",
                    timeEnd: "",
                },
                img: "",
                tags: [],
            },
            processingState: EventProcessingState.CREATE,
            tags: getTags([]),
            places: [],
        })
    );
    resolveRequest();
};
