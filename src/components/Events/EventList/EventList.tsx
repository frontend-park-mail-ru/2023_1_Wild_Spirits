/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { EventCard, EventCardProps } from "components/Events/EventCard/EventCard";
import { EventsLightDataToCardProps, TEventLight } from "models/Events";
import { getUploadsImg } from "modules/getUploadsImg";
import { loadEvents } from "requests/events";
import { LoadStatus } from "requests/LoadStatus";
import "./styles.scss";
import { requestManager } from "requests";
import { setEventsCardsLoadStart } from "flux/slices/eventSlice";
import { store } from "flux";
import { EventListLoading } from "./EventListLoading";

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

        const cardsProps: EventCardProps[] = EventsLightDataToCardProps(cards.data);

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
