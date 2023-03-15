/** @module Components */

import { Component } from "components/Component";
import { EventCard } from "components/Events/EventCard/EventCard";
import EventListTemplate from "templates/Events/EventList/EventList.handlebars";
import config from "config";

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

    parseTimes(start, end) {
        if (start && end) {
            return start + " - " + end;
        }
        return start ? start : end;
    }

    /**
     * fill itself with events from server
     */
    loadEvents() {
        window.ajax
            .get({ url: "/events" })
            .then(({ json, response }) => {
                if (response.ok) {
                    this.#events = [];
                    json.body.events.map((event) => {
                        const { dateStart, dateEnd, timeStart, timeEnd } = event.dates;
                        let dates = [];
                        if (dateStart) {
                            dates.push("Начало: " + dateStart);
                        }
                        if (dateEnd) {
                            dates.push("Конец: \u00A0\u00A0\u00A0" + dateEnd);
                        }
                        if (timeStart || timeEnd) {
                            dates.push(this.parseTimes(timeStart, timeEnd));
                        }
                        this.#events.push(
                            new EventCard(this, {
                                id: event.id,
                                name: event.name,
                                img: config.HOST + event.img,
                                desc: event.desc,
                                dates,
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
