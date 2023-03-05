/** @module Components */

import { Component } from "/components/Component.js";
import { EventCard } from "/components/Events/EventCard/EventCard.js";
import EventListTemplate from "/compiled/Events/EventList/EventList.handlebars.js";

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventList extends Component {
    #events = undefined;
    constructor(parent) {
        super(parent);
        this.loadEvents();
    }

    /**
     * fill itself with events from server
     */
    loadEvents() {
        window.ajax
            .get({ url: "/events" })
            .then(({ json, response }) => {
                if (response.ok) {
                    json.body.events.map((event) => {
                        this.#events.push(
                            new EventCard(this, {
                                name: event.name,
                                img: event.img,
                                desc: event.desc,
                                dates: [
                                    event.dates.dateStart + " " + event.dates.timeStart,
                                    event.dates.dateEnd + " " + event.dates.timeEnd,
                                ],
                                places: event.places,
                            })
                        );
                    });
                    this.rerender();
                }
            })
            .catch((err) => {
                console.log(err);
                this.#events = [];
                for (let i = 0; i < 20; i++) {
                    this.#events.push(
                        new EventCard(this, {
                            name: "Мне сказали, что названиеобычно длиннее одного слова",
                            img: "assets/event_test.png",
                            desc: "С таким названием длинное-предлинное описание уже не кажется таким уж длинным ",
                            dates: ["1 марта 18:00-21:00", "2 марта"],
                            places: ["Парк Лужники", "МЦДЦ Москва-Сити"],
                        })
                    );
                }
                this.rerender();
            });
    }

    render() {
        const renderedEvents = this.#events ? this.#events.map((event) => event.render()) : [];
        return EventListTemplate({ events: renderedEvents });
    }
}
