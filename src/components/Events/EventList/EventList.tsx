/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { EventCard, EventCardProps } from "components/Events/EventCard/EventCard";
import { TEventLight } from "models/Events";
import { getUploadsImg } from "modules/getUploadsImg";
import { loadEvents } from "requests/events";
import { LoadStatus } from "requests/LoadStatus";
import "./styles.scss";
import { requestManager } from "requests";
import { setEventsCardsLoadStart } from "flux/slices/eventSlice";
import { store } from "flux";
import { EventListLoading } from "./EventListLoading";

const SLICE_SIZE = 160;
/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventList extends Component {
    constructor() {
        super({});
    }

    didCreate() {
        console.error("envents loading . . .");
        store.dispatch(setEventsCardsLoadStart());

        requestManager.request(loadEvents);
    }

    render() {
        const { cards } = store.state.events;

        if (cards.loadStatus === LoadStatus.ERROR) {
            return <div> Error </div>;
        }

        if (cards.loadStatus !== LoadStatus.DONE) {
            return <EventListLoading size={6} />;
        }

        const cardsProps: EventCardProps[] = cards.data.map((event: TEventLight) => {
            const { dateStart, dateEnd, timeStart, timeEnd } = event.dates;
            let dates: string[] = [];
            if (dateStart) {
                dates.push("Начало: " + dateStart);
            }
            if (dateEnd) {
                dates.push("Конец: \u00A0\u00A0\u00A0" + dateEnd);
            }
            if (timeStart && timeEnd) {
                dates.push(timeStart + " - " + timeEnd);
            } else if (timeStart || timeEnd) {
                dates.push((timeStart ? timeStart : timeEnd) as string);
            }
            // const places: string[] = event.places.map((place) => place.name);
            const places = event.places;
            return {
                id: event.id,
                name: event.name,
                img: getUploadsImg(event.img),
                description:
                    event.description.length > SLICE_SIZE ? event.description.slice(0, SLICE_SIZE) : event.description,
                dates,
                places,
                org: event.org,
            };
        });

        if (cardsProps.length === 0) {
            return (
                <div className="event-list-empty">
                    <div className="event-list-empty__text">Мероприятия по данным критериям не найдены</div>
                </div>
            );
        }
        return (
            <div className="event-list">
                {cardsProps.map((props) => (
                    <EventCard {...props} />
                ))}
            </div>
        );
    }
}
