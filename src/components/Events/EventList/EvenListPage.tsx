import { VDOM, Component } from "modules/vdom";
import { EventList } from "./EventList";
import { isAuthorized } from "flux/slices/userSlice";
import { store } from "flux";
import { EventCreateButton } from "../EventCreateButton/EventCreateButton";
import { Calendar } from "components/Calendar/Calendar";
import { Tags } from "components/Tags/Tags";
import { toggleTag } from "flux/slices/tagsSlice";
import { requestManager } from "requests";
import { Link } from "components/Common/Link";
import { loadEvents, loadInfinityEvents } from "requests/events";
import { resetEventsCards, setEventsInfinityLoadStart } from "flux/slices/eventSlice";
import { LoadStatus } from "requests/LoadStatus";
import { EventListLoading } from "./EventListLoading";

const GoMapBtn = () => {
    return (
        <div className="full-button-link-container">
            <Link href="/map" className="full-button-link">
                Поиск по карте
            </Link>
        </div>
    );
};

export class EventListPage extends Component {
    didCreate() {
        window.addEventListener("scroll", this.loadEventOnEnd);
    }

    willDestroy() {
        window.removeEventListener("scroll", this.loadEventOnEnd);
        store.dispatch(resetEventsCards());
    }

    loadEventOnEnd() {
        const block = document.getElementById("event-list-page");
        if (!block) {
            return;
        }

        const y = window.scrollY + window.innerHeight;

        if (!(y >= block.offsetHeight - 200)) {
            return;
        }
        console.log("scrolled");
        const { isEnd, status, pageNumber } = store.state.events.cardsInfinity;
        if (isEnd || status === LoadStatus.LOADING || status === LoadStatus.ERROR) {
            return;
        }
        console.log("start new Loading");

        store.dispatch(setEventsInfinityLoadStart());
        requestManager.request(loadInfinityEvents, pageNumber + 1);
    }

    render() {
        const { isEnd, status } = store.state.events.cardsInfinity;
        return (
            <div id="event-list-page" className="row">
                <EventList request={loadEvents} events={store.state.events.cards} showEmptyMessage={true}>
                    {status === LoadStatus.LOADING && <EventListLoading size={6} />}
                    {/* status === LoadStatus.ERROR &&  */}
                    {/* isEnd && */}
                </EventList>

                {!store.state.meta.collapsed.headerCollapsed && (
                    <div className="event-list-page__sidebar">
                        {isAuthorized(store.state.user) && <EventCreateButton />}
                        <GoMapBtn />
                        <Calendar />

                        <Tags
                            tagsState={store.state.tags}
                            toggleTag={(tag) => {
                                store.dispatch(toggleTag(tag));
                                requestManager.request(loadEvents);
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }
}
