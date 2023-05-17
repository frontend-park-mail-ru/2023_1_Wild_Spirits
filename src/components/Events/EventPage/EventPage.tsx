/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { getUploadsImg } from "modules/getUploadsImg";
import { requestManager } from "requests";
import { dislikeEvent, likeEvent, loadEventPage, featureEvent, unfeatureEvent } from "requests/events";
import { setSelectedEventLoadStart } from "flux/slices/eventSlice";
import { store } from "flux";
import { LoadStatus } from "requests/LoadStatus";
import { Table } from "components/Common/Table";
import { isAuthorized } from "flux/slices/userSlice";
import { Loading } from "components/Common/Loading";
import { EventPageMap } from "./EventPageMap";
import { SVGInline } from "components/Common/SVGInline";
import { TEvent } from "models/Events";
import { OrgEvents } from "../OrgEvents/OrgEvents";
import { router } from "modules/router";

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventPage extends Component {
    getEventId(): number {
        const url = router.getNextUrlNotRemove();
        return parseInt(url.slice(1));
    }

    didCreate() {
        store.dispatch(setSelectedEventLoadStart());
        const eventId = this.getEventId();
        requestManager.request(loadEventPage, eventId);
    }

    toggleLike(event: TEvent) {
        if (!event.liked) {
            requestManager.request(likeEvent, event.id);
        } else {
            requestManager.request(dislikeEvent, event.id);
        }
    }

    toggleFeatured(event: TEvent) {
        if (!event.reminded) {
            requestManager.request(featureEvent, event.id);
        } else {
            requestManager.request(unfeatureEvent, event.id);
        }
    }

    render() {
        const { selectedEvent } = store.state.events;

        if (selectedEvent.loadStatus === LoadStatus.ERROR) {
            return <div>Error</div>;
        }

        if (selectedEvent.loadStatus !== LoadStatus.DONE) {
            return (
                <div className="laoding-page-container">
                    <Loading size="xxl" />
                </div>
            );
        }

        const { event, organizer, places } = selectedEvent;
        const fixedPlaces = Object.values(places).map((place) => ({
            city: place.city.name,
            name: place.name,
            address: place.address,
        }));

        return (
            <div className="event-page">
                <div className="event-page__content">
                    <div className="event-page__name">{event.name}</div>
                    <div className="event-page__img-block">
                        <img src={getUploadsImg(event.img)} alt={event.name} className="event-page__img" />
                    </div>
                    <div className="event-page__title">Подробнее о мероприятии</div>
                    <div className="event-page__description">{event.description}</div>
                    <div className="event-page__title">Когда</div>
                    <div>
                        {event.dates.dateStart && <div>Начало: {event.dates.dateStart}</div>}
                        {event.dates.dateEnd && <div>Конец: {event.dates.dateEnd}</div>}
                        {(event.dates.timeStart || event.dates.timeEnd) && (
                            <div>
                                {event.dates.timeStart}
                                {event.dates.timeStart && event.dates.timeEnd && " - "}
                                {event.dates.timeEnd}
                            </div>
                        )}
                    </div>
                    <div className="event-page__title">Где?</div>
                    <div className="event-page__where">
                        {fixedPlaces.map((place) => (
                            <div>
                                {place.city}, {place.name}, {place.address}
                            </div>
                        ))}
                    </div>
                    <div className="">
                        <EventPageMap points={Object.values(places).map(({ lat, lon }) => ({ lat, lon }))} />
                    </div>
                    <div className="event-page__tags tags-menu">
                        {(event.tags !== null ? event.tags : []).map((tag) => (
                            <div className="tag">{tag}</div>
                        ))}
                    </div>
                    <Table
                        data={[
                            { title: "Организатор", value: organizer.name },
                            { title: "Номер телефона", value: organizer.phone || "Не указан" },
                            { title: "Почта", value: organizer.email || "Не указана" },
                            { title: "Сайт", value: organizer.website || "Не указан" },
                        ]}
                    />
                    <div className="event-page__button-block">
                        <div className="event-card__stats-container">
                            <button
                                className={`event-page__button-outline-like event-page__button${
                                    event.liked ? " filled" : ""
                                }`}
                                onClick={() => {
                                    this.toggleLike(event);
                                }}
                            >
                                <SVGInline
                                    className="event-page__button-icon-like stroke-svg-icon"
                                    src="/assets/img/page/like-icon.svg"
                                    alt="like"
                                />
                            </button>
                            <span>{event.likes.toString()}</span>
                        </div>
                        {/* <div className="event-page__button-outline event-page__button-invite">
                        <SVGInline src="/assets/img/page/invite-icon.svg" alt="invite" className="event-page__button-icon" />
                        <div className="event-page__button-text"> Пригласить друга </div>
                    </div> */}
                        {isAuthorized(store.state.user) && event.is_mine ? (
                            <button
                                className="event-page__button-outline event-page__button"
                                onClick={() => router.go(`/editevent/${event.id}`)}
                            >
                                <SVGInline
                                    className="event-page__button-icon stroke-svg-icon"
                                    src="/assets/img/page/edit-icon.svg"
                                    alt="edit"
                                />
                            </button>
                        ) : (
                            <button
                                className={`event-page__button-outline event-page__button${
                                    event.reminded ? " filled" : ""
                                }`}
                                onClick={() => {
                                    this.toggleFeatured(event);
                                }}
                            >
                                <SVGInline
                                    className="event-page__button-icon stroke-svg-icon"
                                    src="/assets/img/save-icon.svg"
                                    alt="save"
                                />
                            </button>
                        )}

                        <a  href={`https://vk.com/share.php?url=https://event-radar.ru/events/${selectedEvent.event.id}`}
                            target="_blank"
                            className="event-page__link-icon"
                        >
                            {/* Поделиться ВКонтакте */}
                            <img src="https://vk.com/images/svg_icons/widgets/widgets_logo.svg" width="60px"></img>
                            {/* <SVGInline
                                src="https://vk.com/images/svg_icons/widgets/widgets_logo.svg"
                                alt="Поделиться ВКонтакте"

                            /> */}
                        </a>
                    </div>
                </div>
                <OrgEvents />
            </div>
        );
    }
}
