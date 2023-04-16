/** @module Components */

import { Component } from "components/Component";
import { EventCard } from "components/Events/EventCard/EventCard";
import { TEventLight } from "models/Events";
import EventListTemplate from "templates/Events/EventList/EventList.handlebars";
import EventListEmptyTemplate from "templates/Events/EventList/EventListEmpty.handlebars";
import { store } from "flux";
import { getUploadsImg } from "modules/getUploadsImg";
import { router } from "modules/router";
import { loadEvents } from "requests/events";
import { LoadStatus } from "requests/LoadStatus";
import "./styles.scss";

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventList extends Component {
    constructor(parent: Component) {
        super(parent);
    }

    loadEvents() {
        const { events: eventsState, user: userState, header: headerState } = store.getState();
        let loadStatus = eventsState.eventsLoadStatus;

        if (router.isUrlChanged()) {
            loadStatus = LoadStatus.NONE;
        }

        if (
            (loadStatus === LoadStatus.NONE || loadStatus === LoadStatus.ERROR) &&
            userState.authorizedLoadStatus === LoadStatus.DONE &&
            headerState.citiesLoadStatus === LoadStatus.DONE
        ) {
            // loadEvents();
        }
    }

    render() {
        const events = store.getState().events.events;

        let cards: EventCard[] = [];
        if (events) {
            cards = events.map((event: TEventLight) => {
                const { dateStart, dateEnd, timeStart, timeEnd } = event.dates;
                let dates: string[] = [];
                if (dateStart) {
                    dates.push("Начало: " + dateStart);
                }
                if (dateEnd) {
                    dates.push("Конец: \u00A0\u00A0\u00A0" + dateEnd);
                }
                if (timeStart && timeEnd) {
                    dates.push(timeStart + " - " + timeEnd);
                } else if (timeStart || timeEnd) {
                    dates.push((timeStart ? timeStart : timeEnd) as string);
                }
                // const places: string[] = event.places.map((place) => place.name);
                const places = event.places;
                return new EventCard(this, {
                    id: event.id,
                    name: event.name,
                    img: getUploadsImg(event.img),
                    description: event.description,
                    dates,
                    places,
                    org: event.org,
                });
            });
        }

        const renderedEvents: string[] = cards ? cards.map((card) => card.render()) : [];
        const { eventsLoadStatus } = store.getState().events;
        if (eventsLoadStatus === LoadStatus.NONE || eventsLoadStatus === LoadStatus.LOADING) {
            return "<div>Loading . . . </div>";
        }
        if (renderedEvents.length === 0) {
            return EventListEmptyTemplate();
        }
        return EventListTemplate({ events: renderedEvents });
    }
}
