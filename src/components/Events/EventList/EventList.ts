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
import { requestManager } from "requests";
import { setEventsCardsLoadStart } from "flux/slices/eventSlice";

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
        if (!router.isUrlChanged()) {
            return;
        }

        store.dispatch(setEventsCardsLoadStart());

        requestManager.request(loadEvents);
    }

    render() {
        const { cards } = store.getState().events;

        if (cards.loadStatus === LoadStatus.DONE) {
            let cardsComponents: EventCard[] = cards.data.map((event: TEventLight) => {
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
            const renderedEvents: string[] = cardsComponents.map((component) => component.render());

            if (renderedEvents.length === 0) {
                return EventListEmptyTemplate();
            }
            return EventListTemplate({ events: renderedEvents });
        } else if (cards.loadStatus === LoadStatus.ERROR) {
            return "Error";
        }

        return "Loading . . .";
    }
}
