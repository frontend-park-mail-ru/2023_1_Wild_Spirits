/** @module Components */

import { Component } from "components/Component";
import config from "config";
import { store } from "flux";
import { TEvent, TEventOrganizer, TEventPlace } from "models/Events";
import { ajax } from "modules/ajax";
import { router } from "modules/router";
import { ResponseEvent } from "responses/ResponseEvent";
import EventPageTemplate from "templates/Events/EventPage/EventPage.handlebars";
import TagsTemplate from "templates/Tags/Tags.handlebars";
import TableTemplate from "templates/Common/Table.handlebars";
import { createTable } from "components/Common/CreateTable";

interface EventData {
    event: TEvent;
    places: TEventPlace[];
    organizer: TEventOrganizer;
}

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventPage extends Component {
    #eventData: EventData | undefined = undefined;
    #lastEventId: number | undefined = undefined;

    constructor(parent: Component) {
        super(parent);
    }

    getEventId(): number {
        const url = router.getNextUrl();
        return parseInt(url.slice(1));
    }

    /**
     * fill itself with event from server
     */
    loadEvent() {
        const eventId = this.getEventId();
        ajax.get<ResponseEvent>({ url: `/events/${eventId}` })
            .then(({ json, response }) => {
                if (response.ok) {
                    const { event, places, organizer } = json.body;
                    this.#eventData = { event, places, organizer };
                    this.rerender();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        if (this.#eventData !== undefined) {
            const { event, organizer, places } = this.#eventData;
            console.log(places);
            return EventPageTemplate({
                name: event.name,
                description: event.desc,
                img: config.HOST + event.img,
                tags: TagsTemplate({
                    tags: store.getState().tags,
                }),
                places,
                moreInfo: TableTemplate({
                    rows: createTable({
                        Организатор: organizer.name,
                        "Номер телефона": organizer.phone,
                        Почта: organizer.email,
                    }),
                }),
            });
        }
    }
}
