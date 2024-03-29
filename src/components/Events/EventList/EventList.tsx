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

type ChildType = JSX.Element | string | false;

export interface EventListProps {
    events: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
    request?: TRequest;
    showEmptyMessage?: boolean;
    children?: ChildType[] | ChildType;
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

    didCreate() {
        if (this.props.request) {
            store.dispatch(setEventsCardsLoadStart());
            requestManager.request(this.props.request);
        }
    }

    render() {
        const events = this.props.events;

        if (events.loadStatus === LoadStatus.ERROR) {
            return <div className="event-list-base"> Error </div>;
        }

        if (events.loadStatus !== LoadStatus.DONE) {
            return (
                <div className="event-list-base">
                    <EventListLoading size={6} />
                </div>
            );
        }

        const cardsProps: EventCardProps[] = eventsLightDataToCardProps(events.data);

        if (cardsProps.length === 0 && this.props.showEmptyMessage) {
            return (
                <div className="event-list-base">
                    <div className="event-list-empty__text">Мероприятия по данным критериям не найдены</div>
                </div>
            );
        }

        return (
            <div className="event-list">
                {cardsProps.map((props) => (
                    <EventCard {...props} />
                ))}
                {Array.isArray(this.props.children)
                    ? this.props.children.map((child) => child).flat()
                    : this.props.children}
            </div>
        );
    }
}
