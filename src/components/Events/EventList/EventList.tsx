/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { EventCard, EventCardProps } from "components/Events/EventCard/EventCard";
import { eventsLightDataToCardProps, TEventLight } from "models/Events";
import { getUploadsImg } from "modules/getUploadsImg";
import { loadEvents } from "requests/events";
import { LoadStatus } from "requests/LoadStatus";
import "./styles.scss";
import { requestManager } from "requests";
import { setEventsCardsLoadStart } from "flux/slices/eventSlice";
import { store } from "flux";
import { EventListLoading } from "./EventListLoading";
import { TRequest } from "requests/requestTypes";
import { EventsState } from "flux/slices/eventSlice";

interface EventListProps<PROPS extends any[] = any[]> {
    // getEvents: (state: EventsState) => LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
    events: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
    request: TRequest<PROPS>;
    requestArgs?: PROPS;
}

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventList extends Component<EventListProps, {}> {
    constructor(props: EventListProps) {
        super(props);
    }

    loadEvents() {
        if (this.props.requestArgs) {
            requestManager.request(this.props.request, ...this.props.requestArgs);
        } else {
            requestManager.request(this.props.request);
        }
    }

    didCreate() {
        store.dispatch(setEventsCardsLoadStart());
        this.loadEvents();
    }

    didUpdate() {
        // this.loadEvents();
    }

    render() {
        const events = this.props.events;

        if (events.loadStatus === LoadStatus.ERROR) {
            return <div> Error </div>;
        }

        if (events.loadStatus !== LoadStatus.DONE) {
            return (
                <div>
                    <EventListLoading size={6} />
                </div>
            );
        }

        const cardsProps: EventCardProps[] = eventsLightDataToCardProps(events.data);

        if (cardsProps.length === 0) {
            return <div></div>;
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
