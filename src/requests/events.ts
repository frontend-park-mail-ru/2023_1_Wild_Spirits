import { store } from "flux";
import { getSelectedTags } from "flux/slices/tagsSlice";
import { getSelectedCityName } from "flux/slices/headerSlice";
import { getSelectedCategory } from "flux/slices/headerSlice";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseEventsLight } from "responses/ResponseEvent";
import { setEvents, setEventsLoadStart } from "flux/slices/eventSlice";
import { UrlPropsType } from "modules/ajax";

/**
 * fill itself with events from server
 */
export const loadEvents = () => {
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

    store.dispatch(setEventsLoadStart());
    ajax.get<ResponseEventsLight>({
        url: "/events",
        urlProps: props,
    })
        .then(({ json, response, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(setEvents({ events: json.body.events }));
            }
        })
        .catch((error) => {
            console.log(error);
            store.dispatch(setEvents({ events: [] }));
        });
};
