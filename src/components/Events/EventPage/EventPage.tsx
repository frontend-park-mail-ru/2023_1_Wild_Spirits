/** @module Components */

import { createVNode, Component } from "modules/vdom";
import { router } from "modules/router";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { requestManager } from "requests";
import { loadEventPage } from "requests/events";
import { setSelectedEventLoadStart } from "flux/slices/eventSlice";
import { store } from "flux";
import { LoadStatus } from "requests/LoadStatus";
import { Table } from "components/Common/Table";

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventPage extends Component<any> {
    constructor() {
        super({});
    }

    getEventId(): number {
        const url = router.getNextUrl();
        console.log(url);
        return parseInt(url.slice(1));
    }

    didCreate() {
        console.error("didCreate EventPage");
        store.dispatch(setSelectedEventLoadStart());
        const eventId = this.getEventId();
        requestManager.request(loadEventPage, eventId);
    }

    render() {
        const { selectedEvent } = store.getState().events;
        if (selectedEvent.loadStatus === LoadStatus.DONE) {
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
                        {event.tags.map((tag) => (
                            <div className="tag">{tag}</div>
                        ))}
                    </div>
                    <Table
                        data={[
                            { title: "Организатор", value: organizer.name },
                            { title: "Номер телефона", value: organizer.phone },
                            { title: "Почта", value: organizer.email },
                        ]}
                    />
                    <div className="event-page__more-info">{/* {{{moreInfo}}} */}</div>
                    <div className="event-page__button-block">
                        <div className="button-outline button-outline-like event-page__button">
                            <div className="heart-icon-container event-page__button-icon"></div>
                        </div>
                        <div className="button-outline button-outline-other event-page__button">
                            <div className="bookmark-icon-container event-page__button-icon"></div>
                        </div>
                        <div className="button-outline button-outline-other event-page__button">
                            <div className="invite-icon-container event-page__button-icon"></div>
                            <div className="event-page__button-text"> Пригласить друга </div>
                        </div>
                    </div>
                </div>
            );
        } else if (selectedEvent.loadStatus === LoadStatus.ERROR) {
            return <div>Error</div>;
        }

        return <div>Loading2 . . .</div>;
    }
}
