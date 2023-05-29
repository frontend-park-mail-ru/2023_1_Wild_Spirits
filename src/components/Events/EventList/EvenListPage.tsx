import { VDOM, Component } from "modules/vdom";
import { EventList } from "./EventList";
import { store } from "flux";
import { requestManager } from "requests";
import { loadEvents, loadInfinityEvents } from "requests/events";
import { resetEventsCards, setEventsCardsInfinityLoadStart } from "flux/slices/eventSlice";
import { LoadStatus } from "requests/LoadStatus";
import { Loading } from "components/Common/Loading";
import { EventListSidebar } from "./EventListSidebar";
import { clearFilters } from "modules/filters";

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

        store.dispatch(setEventsCardsInfinityLoadStart());
        requestManager.request(loadInfinityEvents, pageNumber + 1);
    }

    render() {
        const { isEnd, status } = store.state.events.cardsInfinity;
        // const cardClassName = "col-l-12 col-xxl-6 col-4";
        const cardClassName = "col-12 col-s-6 col-m-12 col-xl-6 col-xxl-4 event-card-container";

        return (
            <div id="event-list-page" className="event-list-page">
                <div className="row-no-wrap">
                    <div className="col">
                        <div
                            className="event-list__clear link-button"
                            onClick={() => {
                                clearFilters();
                                requestManager.request(loadEvents);
                            }}
                        >
                            Сбросить фильтры
                        </div>
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
                                    <div className={cardClassName}>
                                        <div className="card event-card event-card-loading">
                                            <Loading size="xl" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                status === LoadStatus.ERROR && <div className="w-100 text-center col-12">Error</div>
                            )}
                        </EventList>
                    </div>
                    {!store.state.meta.collapsed.headerCollapsed && <EventListSidebar />}
                </div>
            </div>
        );
    }
}
