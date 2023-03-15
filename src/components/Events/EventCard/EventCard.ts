/** @module Components */

import { Component } from "components/Component";
import EventCardTemplate from "templates/Events/EventCard/EventCard.handlebars";
import EventCardMarkerTemplate from "templates/Events/EventCard/EventCardMarker.handlebars";

/**
 * event card component
 * @class
 * @extends Component
 */
export class EventCard extends Component {
    #props;
    constructor(parent, props) {
        super(parent);
        this.#props = props;
    }

    render() {
        return EventCardTemplate({
            eventId: this.#props.id,
            img: this.#props.img,
            name: this.#props.name,
            desc: this.#props.desc,
            dates: EventCardMarkerTemplate({
                img_src: "/assets/calendar_icon.png",
                title: "Даты",
                items: this.#props.dates,
            }),
            places: EventCardMarkerTemplate({
                img_src: "/assets/position_icon.png",
                title: "Места",
                items: this.#props.places,
            }),
        });
    }
}
