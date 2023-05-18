/** @module Components */

import { Link } from "components/Common/Link";
import { store } from "flux";
import { setOrgEventsLoadStart, setSelectedEventLoadStart } from "flux/slices/eventSlice";
import { fixEventDates } from "models/Events";
import { SIDEBAR_FLEX_CLASS_NAME } from "modules/commonClasses";
import { getUploadsImg } from "modules/getUploadsImg";
import { router } from "modules/router";
import { VDOM, Component } from "modules/vdom";
import { requestManager } from "requests";
import { LoadStatus } from "requests/LoadStatus";
import { loadEventPage, loadEventPageOrgEvents } from "requests/events";

export class OrgEvents extends Component {
    didCreate() {
        store.dispatch(setOrgEventsLoadStart());

        requestManager.request(loadEventPageOrgEvents);
        this.getEventId = this.getEventId.bind(this);
        this.loadNewEventPage = this.loadNewEventPage.bind(this);
    }

    getEventId(): number {
        const url = router.getNextUrlNotRemove();
        return parseInt(url.slice(1));
    }

    loadNewEventPage() {
        store.dispatch(setSelectedEventLoadStart());
        const eventId = this.getEventId();
        requestManager.request(loadEventPage, eventId);
    }

    render() {
        const { orgEvents, selectedEvent } = store.state.events;

        if (orgEvents.loadStatus === LoadStatus.ERROR) {
            return <div> Error </div>;
        }

        if (orgEvents.loadStatus !== LoadStatus.DONE || selectedEvent.loadStatus !== LoadStatus.DONE) {
            return <div> LOADING </div>;
            // TODO return <EventListLoading size={6} />;
        }
        selectedEvent.event.id;
        return (
            <div className={`col-xl-12 ${SIDEBAR_FLEX_CLASS_NAME}`}>
                <div className="org-events-list">
                    <div className="org-events-list-title">От того же организатора</div>

                    <div className="org-events-list__card-block">
                        {orgEvents.data.map((event) =>
                            selectedEvent.event.id === event.id ? undefined : (
                                <div className="card event-card">
                                    <Link
                                        id={`event_${event.id}`}
                                        className="event-card__content"
                                        href={`/events/${event.id}`}
                                        onClick={this.loadNewEventPage}
                                    >
                                        <div className="card__img-block">
                                            <img
                                                className="card__img"
                                                src={getUploadsImg(event.img)}
                                                alt={event.name}
                                            />
                                        </div>
                                        <div className="card__body event-card__body">
                                            <div className="card__title org-events-list__card-title">{event.name}</div>
                                            {fixEventDates(event.dates).map((item) => (
                                                <div>{item}</div>
                                            ))}
                                            <hr className="card__hr" />
                                            {event.places.map((item) => (
                                                <div>{item}</div>
                                            ))}
                                        </div>
                                    </Link>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
