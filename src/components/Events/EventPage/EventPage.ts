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
import { requestManager } from "requests";
import { loadEventPage } from "requests/events";
import { setSelectedEventLoadStart } from "flux/slices/eventSlice";
import { store } from "flux";
import { LoadStatus } from "requests/LoadStatus";

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventPage extends Component {
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
        if (!router.isUrlChanged()) {
            return;
        }

        store.dispatch(setSelectedEventLoadStart());

        const eventId = this.getEventId();
        requestManager.request(loadEventPage, eventId);
    }

    render() {
        const { selectedEvent } = store.getState().events;
        if (selectedEvent.loadStatus === LoadStatus.DONE) {
            const { event, organizer, places } = selectedEvent;
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
        } else if (selectedEvent.loadStatus === LoadStatus.ERROR) {
            return "Error";
        }

        return "Loading . . .";
    }
}
