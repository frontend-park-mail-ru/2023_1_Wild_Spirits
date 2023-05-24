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
import { resetEventsCards, setEventsCardsLoadStart, setEventsInfinityLoadStart } from "flux/slices/eventSlice";
import { LoadStatus } from "requests/LoadStatus";
import { Loading } from "components/Common/Loading";

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
        const { isEnd, status, pageNumber } = store.state.events.cardsInfinity;
        if (isEnd || status === LoadStatus.LOADING || status === LoadStatus.ERROR) {
            return;
        }

        store.dispatch(setEventsInfinityLoadStart());
        requestManager.request(loadInfinityEvents, pageNumber + 1);
    }

    render() {
        const { isEnd, status } = store.state.events.cardsInfinity;
        const cardClassName = "col-l-12 col-xxl-6 col-4";

        return (
            <div id="event-list-page" className="row">
                <div className="col-m-12 col-11">
                    <EventList
                        request={loadEvents}
                        events={store.state.events.cards}
                        showEmptyMessage={true}
                        cardClassName={cardClassName}
                    >
                        {isEnd ? (
                            <div className="w-100 text-center col-12"> По данному запросу больше ничего нет </div>
                        ) : status === LoadStatus.LOADING ? (
                            Array.from(Array(6)).map(() => (
                                <div className={`card event-card event-card-loading ${cardClassName}`}>
                                    <Loading size="xl" />
                                </div>
                            ))
                        ) : (
                            status === LoadStatus.ERROR && <div className="w-100 text-center col-12">Error</div>
                        )}
                    </EventList>
                </div>
                {!store.state.meta.collapsed.headerCollapsed && (
                    <div className="col sidebar">
                        {isAuthorized(store.state.user) && <EventCreateButton />}
                        <GoMapBtn />
                        <Calendar />

                        <Tags
                            tagsState={store.state.tags}
                            toggleTag={(tag) => {
                                store.dispatch(toggleTag(tag), setEventsCardsLoadStart());
                                requestManager.request(loadEvents);
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }
}
