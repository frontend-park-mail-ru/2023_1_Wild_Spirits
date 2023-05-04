/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { EventCard, EventCardProps } from "components/Events/EventCard/EventCard";
import { eventsLightDataToCardProps, TEventLight } from "models/Events";
import { LoadStatus } from "requests/LoadStatus";
import { requestManager } from "requests";
import { setEventsCardsLoadStart } from "flux/slices/eventSlice";
import { store } from "flux";
import { EventListLoading } from "./EventListLoading";
import { TRequest } from "requests/requestTypes";
import { EventCreateButton } from "../EventCreateButton/EventCreateButton";
import { isAuthorized } from "flux/slices/userSlice";
import { Tags } from "components/Tags/Tags";
import { Calendar } from "components/Calendar/Calendar";
import { toggleTag } from "flux/slices/tagsSlice";
import { Link } from "components/Common/Link";

export interface EventListProps {
    events: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
    request: TRequest;
}

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventList extends Component<EventListProps> {
    constructor(props: EventListProps) {
        super(props);
    }

    loadEvents() {
        requestManager.request(this.props.request);
    }

    didCreate() {
        store.dispatch(setEventsCardsLoadStart());
        this.loadEvents();
    }

    render() {
        const events = this.props.events;

        if (events.loadStatus === LoadStatus.ERROR) {
            return <div> Error </div>;
        }

        if (events.loadStatus !== LoadStatus.DONE) {
            return (
                <div className="event-list-loading-block">
                    <EventListLoading size={6} />
                </div>
            );
        }

        const cardsProps: EventCardProps[] = eventsLightDataToCardProps(events.data);

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
