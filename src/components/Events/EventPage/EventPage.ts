/** @module Components */

import { Component } from "components/Component";
import config from "config";
import { TEvent, TEventPlace } from "models/Events";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { router } from "modules/router";
import { ResponseEvent } from "responses/ResponseEvent";
import EventPageTemplate from "templates/Events/EventPage/EventPage.handlebars";
import TableTemplate from "templates/Common/Table.handlebars";
import { createTable } from "components/Common/CreateTable";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { TOrganizer } from "models/Organizer";

interface EventData {
    event: TEvent;
    places: TEventPlace[];
    organizer: TOrganizer;
}

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventPage extends Component {
    #eventData: EventData | undefined = undefined;

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
            .then(({ json, response, status }) => {
                if (status === AjaxResultStatus.SUCCESS) {
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
            const fixedPlaces = Object.values(places).map((place) => ({
                city: place.city.name,
                name: place.name,
                address: place.address,
            }));

            return EventPageTemplate({
                name: event.name,
                description: event.description,
                img: getUploadsImg(event.img),
                tags: event.tags,
                places: fixedPlaces,
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
