/** @module Components */

import { Component } from "components/Component";
import { EventCard } from "components/Events/EventCard/EventCard";
import config from "config";
import { TEventLight } from "models/Events";
import { ajax } from "modules/ajax";
import { ResponseEventsLight } from "responses/ResponseEvent";
import EventListTemplate from "templates/Events/EventList/EventList.handlebars";

import { store } from "flux";
import { setEvents, selectEvent } from "flux/slices/eventSlice"

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventList extends Component {
    // #events: EventCard[] | undefined = undefined;
    constructor(parent: Component) {
        super(parent);
        this.loadEvents();
    }

    /**
     * fill itself with events from server
     */
    loadEvents() {
        ajax.get<ResponseEventsLight>({ url: "/events" })
            .then(({ json, response }) => {
                if (response.ok) {
                    let events: EventCard[] = [];
                    json.body!.events.map((event: TEventLight) => {
                        console.log(event);
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
                        events.push(
                            new EventCard(this, {
                                id: event.id,
                                name: event.name,
                                img: config.HOST + event.img,
                                desc: event.desc,
                                dates,
                                places,
                            })
                        );
                    });
                    store.dispatch(setEvents({events: events}));
                }
            })
            .catch((error) => {
                console.log(error);
                let events = [];
                for (let i = 0; i < 20; i++) {
                    events.push(
                        new EventCard(this, {
                            id: i,
                            name: "Мне сказали, что названиеобычно длиннее одного слова",
                            img: "assets/event_test.png",
                            desc: "С таким названием длинное-предлинное описание уже не кажется таким уж длинным ",
                            dates: ["1 марта 18:00-21:00", "2 марта"],
                            places: ["Парк Лужники", "МЦДЦ Москва-Сити"],
                        })
                    );
                }

                store.dispatch(setEvents({events: events}));
            });
    }

    render() {
        const events = store.getState().events.eventCards;
        const renderedEvents = events ? events.map((event) => event.render()) : [];
        return EventListTemplate({ events: renderedEvents });
    }
}
