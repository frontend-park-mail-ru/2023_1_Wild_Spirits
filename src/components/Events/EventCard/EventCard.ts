/** @module Components */

import { Component } from "components/Component";
import { store } from "flux";
import { TOrgLight } from "models/Events";
import { isAuthorized } from "flux/slices/userSlice";
import EventCardTemplate from "templates/Events/EventCard/EventCard.handlebars";
import EventCardMarkerTemplate from "templates/Events/EventCard/EventCardMarker.handlebars";
import "./styles.scss";

interface EventCardProps {
    id: number;
    name: string;
    description: string;
    img: string;
    dates: string[];
    places: string[];
    org: TOrgLight;
}

/**
 * event card component
 * @class
 * @extends Component
 */
export class EventCard extends Component {
    #props: EventCardProps;
    constructor(parent: Component, props: EventCardProps) {
        super(parent);
        this.#props = props;
    }

    render() {
        return EventCardTemplate({
            eventId: this.#props.id,
            img: this.#props.img,
            name: this.#props.name,
            desc: this.#props.description,
            dates: EventCardMarkerTemplate({
                img_src: "/assets/img/calendar_icon.png",
                title: "Даты",
                items: this.#props.dates,
            }),
            places: EventCardMarkerTemplate({
                img_src: "/assets/img/position_icon.png",
                title: "Места",
                items: this.#props.places,
            }),
            mine: isAuthorized(store.getState().user),
        });
    }
}
