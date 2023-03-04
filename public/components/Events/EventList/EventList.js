import { Component } from "/components/Component.js";
import { EventCard } from "/components/Events/EventCard/EventCard.js";
import EventListTemplate from "/compiled/Events/EventList/EventList.handlebars.js";

export class EventList extends Component {
    #events = undefined;
    constructor(parent) {
        super(parent);
        this.loadEvents();
    }

    loadEvents() {
        window.ajax
            .get({ url: "/events" })
            .then(({ json, response }) => {
                if (response.ok) {
                    events = json.body.events;
                } else {
                }
            })
            .catch((err) => {
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
