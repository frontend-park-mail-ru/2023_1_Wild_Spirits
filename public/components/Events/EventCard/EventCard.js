/** @module Components */

import { Component } from "/components/Component.js";
import EventCardTemplate from "/compiled/Events/EventCard/EventCard.handlebars.js";
import EventCardMarkerTemplate from "/compiled/Events/EventCard/EventCardMarker.handlebars.js";

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
