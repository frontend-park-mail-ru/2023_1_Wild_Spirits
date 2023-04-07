/** @module Components */

import { Component } from "components/Component";
import config from "config";
import { store } from "flux";
import { TEvent, TEventPlace } from "models/Events";
import { ajax } from "modules/ajax";
import { router } from "modules/router";
import { ResponseEvent } from "responses/ResponseEvent";
import EventPageTemplate from "templates/Events/EventPage/EventPage.handlebars";
import TagsTemplate from "templates/Tags/Tags.handlebars";

interface EventData {
    event: TEvent;
    places: TEventPlace[];
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
        if (this.#lastEventId !== undefined && eventId === this.#lastEventId) {
            return;
        }
        this.#lastEventId = eventId;

        ajax.get<ResponseEvent>({ url: `/events/${eventId}` })
            .then(({ json, response }) => {
                if (response.ok) {
                    const { event, places } = json.body;
                    this.#eventData = { event, places };
                    this.rerender();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        const event = this.#eventData?.event;
        if (event !== undefined) {
            return EventPageTemplate({
                name: event.name,
                description: event.desc,
                img: config.HOST + event.img,
                tags: TagsTemplate({
                    tags: store.getState().tags,
                }),
            });
        }
    }
}
