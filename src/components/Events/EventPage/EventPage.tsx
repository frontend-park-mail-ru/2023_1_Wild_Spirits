/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { router } from "modules/router";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { requestManager } from "requests";
import { loadEventPage } from "requests/events";
import { setSelectedEventLoadStart } from "flux/slices/eventSlice";
import { store } from "flux";
import { LoadStatus } from "requests/LoadStatus";
import { Table } from "components/Common/Table";
import { isAuthorized } from "flux/slices/userSlice";
import { Link } from "components/Common/Link";
import { Loading } from "components/Common/Loading";

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventPage extends Component {
    getEventId(): number {
        const url = router.getNextUrl();
        return parseInt(url.slice(1));
    }

    didCreate() {
        store.dispatch(setSelectedEventLoadStart());
        const eventId = this.getEventId();
        requestManager.request(loadEventPage, eventId);
    }

    render() {
        const { selectedEvent } = store.state.events;

        if (selectedEvent.loadStatus === LoadStatus.ERROR) {
            return <div>Error</div>;
        }

        if (selectedEvent.loadStatus !== LoadStatus.DONE) {
            return <Loading />;
        }

        const { event, organizer, places } = selectedEvent;
        const fixedPlaces = Object.values(places).map((place) => ({
            city: place.city.name,
            name: place.name,
            address: place.address,
        }));

        return (
            <div className="event-page">
                <div className="event-page__name">{event.name}</div>
                <div className="event-page__img-block">
                    <img src={getUploadsImg(event.img)} alt={event.name} className="event-page__img" />
                </div>
                <div className="event-page__title">Подробнее о мероприятии</div>
                <div className="event-page__description">{event.description}</div>
                <div className="event-page__title">Где?</div>
                <div className="event-page__where">
                    {fixedPlaces.map((place) => (
                        <div>
                            {place.city}, {place.name}, {place.address}
                        </div>
                    ))}
                </div>
                <div className="event-page__tags tags-menu">
                    {(event.tags !== null ? event.tags : []).map((tag) => (
                        <div className="tag">{tag}</div>
                    ))}
                </div>
                <div className="event-page__more-info">
                    <Table
                        data={[
                            { title: "Организатор", value: organizer.name },
                            { title: "Номер телефона", value: organizer.phone },
                            { title: "Почта", value: organizer.email },
                        ]}
                    />
                </div>
                <div className="event-page__button-block">
                    <div>
                        <div className="button-outline button-outline-like event-page__button">
                            <img
                                className="event-page__button-icon-like"
                                src="/assets/img/page/like-icon.svg"
                                alt="like"
                            />
                        </div>
                        <div>320</div>
                    </div>
                    <div className="button-outline button-outline-other event-page__button">
                        <img className="event-page__button-icon" src="/assets/img/page/save-icon.svg" alt="save" />
                    </div>
                    <div className="button-outline button-outline-other event-page__button-invite">
                        <img src="/assets/img/page/invite-icon.svg" alt="invite" className="event-page__button-icon" />
                        <div className="event-page__button-text"> Пригласить друга </div>
                    </div>
                    <div className="button-outline button-outline-other event-page__button">
                        {isAuthorized(store.state.user) ? (
                            <Link href={`/editevent/${event.id}`} className="event-page__button-icon">
                                <img src="/assets/img/page/edit-icon.svg" alt="edit" />
                            </Link>
                        ) : (
                            <img src="/assets/img/card/save-icon.svg" alt="save" />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
