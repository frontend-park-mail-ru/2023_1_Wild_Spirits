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
import { TRequestResolver } from "./requestTypes";
import { EventProcessingType } from "models/Events";

/**
 * fill itself with events from server
 */
export const loadEvents = (resolveRequest: TRequestResolver) => {
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

    const city = getSelectedCityName(store.state.header);

    const startDate = store.state.calendar.startDate;
    const finishDate = store.state.calendar.finishDate || startDate;

    const props = filterProps({
        tags: getSelectedTags(store.state.tags),
        cities: city,
        categories: getSelectedCategory(store.state.header),
        dateStart: dateToString(startDate),
        dateEnd: dateToString(finishDate),
        search: store.state.header.searchQuery,
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
            resolveRequest(eventId);
        })
        .catch((error) => {
            onError();
            resolveRequest(eventId);
        });
};

export const loadEventPage = (resolveRequest: TRequestResolver, eventId: number) => {
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
            Object.entries(store.state.tags.tags).map(([key, value]) => {
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

export const loadEventProcessingEdit = (resolveRequest: TRequestResolver, eventId: number) => {
    loadEvent({
        eventId,
        onSuccess: (json) => {
            const event = json.body.event;
            const tags: TagsState = getTags(event.tags);
            store.dispatch(
                setEventProcessingFormData({
                    ...json.body,
                    tags: tags,
                    processingState: EventProcessingType.EDIT,
                })
            );
        },
        onError: () => {
            store.dispatch(setEventProcessingLoadError());
        },
        resolveRequest,
    });
};

export const loadEventProcessingCreate = (resolveRequest: TRequestResolver) => {
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
            processingState: EventProcessingType.CREATE,
            tags: getTags([]),
            places: [],
        })
    );
    resolveRequest();
};
