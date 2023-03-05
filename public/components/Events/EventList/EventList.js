/** @module Components */

import { Component } from "/components/Component.js";
import { EventCard } from "/components/Events/EventCard/EventCard.js";
import EventListTemplate from "/compiled/Events/EventList/EventList.handlebars.js";
import config from "/config.js";

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

    parseDay(date, time) {
        let datetime = [];
        if (date) {
            datetime.push(date);
        }
        if (time) {
            datetime.push(time);
        }
        return datetime.join(" ");
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
                        let dates = [];
                        if (event.dates.dateStart || event.dates.timeStart) {
                            dates.push("Начало: " + this.parseDay(event.dates.dateStart, event.dates.timeStart));
                        }
                        if (event.dates.dateEnd || event.dates.timeEnd) {
                            dates.push("Конец: " + this.parseDay(event.dates.dateEnd, event.dates.timeEnd));
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
