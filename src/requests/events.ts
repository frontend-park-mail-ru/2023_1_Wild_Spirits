import { store } from "flux";
import { getSelectedTags } from "flux/slices/tagsSlice";
import { getSelectedCityName } from "flux/slices/headerSlice";
import { getSelectedCategory } from "flux/slices/headerSlice";
import { ajax } from "modules/ajax";
import { ResponseEventsLight } from "responses/ResponseEvent";
import { EventCard } from "components/Events/EventCard/EventCard";
import { setEvents } from "flux/slices/eventSlice";
import { UrlPropsType } from "modules/ajax";

/**
 * fill itself with events from server
 */
export const loadEvents = () => {
    const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

    const toArrString = (arg: string | string[] | undefined): string | undefined => {
        if (typeof arg === "string") {
            return `[${arg}]`;
        }
        return arg ? `[${arg.join(",")}]` : undefined;
    }

    const dateToString = (date: Date | undefined) => {
        return date ? [zeroPad(date.getDate(),2), 
                zeroPad(date.getMonth(), 2), 
                zeroPad(date.getFullYear(), 4)].join(".") : undefined;
    }

    const filterProps = (props: {[key: string]: string | undefined}): UrlPropsType => {
        return Object.fromEntries(
            Object.entries(props).filter(([_, value]) => {
                return value !== undefined && value !== "[]";
            })
        ) as UrlPropsType;
    }

    const props = filterProps({
        "tags": toArrString(getSelectedTags(store.getState().tags)),
        // "cities": toArrString(getSelectedCityName(store.getState().header)), 
        "categories": toArrString(getSelectedCategory(store.getState().header)),
        "dateStart": dateToString(store.getState().calendar.startDate),
        "finishDate": dateToString(store.getState().calendar.finishDate),
    })

    ajax.get<ResponseEventsLight>({
        url: "/events",
        urlProps: props
    })
        .then(({ json, response }) => {
            if (response.ok) {
                store.dispatch(setEvents({events: json.body!.events}));
            }
        })
        .catch((error) => {
            console.log(error);
            store.dispatch(setEvents({events: []}));
        });
}
