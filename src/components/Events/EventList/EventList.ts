/** @module Components */

import { Component } from "components/Component";
import { EventCard } from "components/Events/EventCard/EventCard";
import config from "config";
import { TEventLight } from "models/Events";
import EventListTemplate from "templates/Events/EventList/EventList.handlebars";

import { store } from "flux";

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventList extends Component {
    constructor(parent: Component) {
        super(parent);
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
                }
                if (timeStart || timeEnd) {
                    dates.push((timeStart ? timeStart : timeEnd) as string);
                }
                // const places: string[] = event.places.map((place) => place.name);
                const places = event.places;
                return new EventCard(this, {
                    id: event.id,
                    name: event.name,
                    img: config.HOST + "/" + event.img,
                    description: event.description,
                    dates,
                    places,
                    org: event.org,
                });
            });
        }

        const renderedEvents = cards ? cards.map((card) => card.render()) : [];
        return EventListTemplate({ events: renderedEvents });
    }
}
