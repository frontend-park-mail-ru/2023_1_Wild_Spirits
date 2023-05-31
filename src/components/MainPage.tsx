import { VDOM, Component } from "modules/vdom";
import { store } from "flux";
import { loadEvents, loadLikedEvents, loadPlannedEvents, loadSubbedEvents } from "requests/events";
import { resetEventsCards } from "flux/slices/eventSlice";
import { EventCarousel } from "./Events/EventCarousel/EventCarousel";
import { EventListSidebar } from "./Events/EventList/EventListSidebar";
import { isAuthorized } from "flux/slices/userSlice";
import { LoadStatus } from "requests/LoadStatus";

export class MainPage extends Component {
    willDestroy() {
        store.dispatch(resetEventsCards());
    }

    render() {
        return (
            <div id="event-list-page">
                <div className="row-no-wrap">
                    <div className="col">
                        {isAuthorized(store.state.user) && (
                            <EventCarousel
                                title="По предпочтениям"
                                events={store.state.events.subbedEvents}
                                request={loadSubbedEvents}
                            />
                        )}
                        <EventCarousel
                            title="Все мероприятия"
                            events={store.state.events.cards}
                            request={loadEvents}
                            href="/eventslist"
                        />
                        {isAuthorized(store.state.user) && (
                            <EventCarousel
                                title="Понравившиеся"
                                events={store.state.events.likedEvents}
                                request={loadLikedEvents}
                            />
                        )}
                        {isAuthorized(store.state.user) && (
                            <EventCarousel
                                title="Запланированные"
                                events={store.state.events.plannedEvents}
                                request={loadPlannedEvents}
                            />
                        )}
                    </div>
                    {!store.state.meta.collapsed.headerCollapsed && <EventListSidebar />}
                </div>
            </div>
        );
    }
}
