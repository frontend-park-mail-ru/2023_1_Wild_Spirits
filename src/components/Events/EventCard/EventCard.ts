/** @module Components */

import { Component } from "components/Component";
import { store } from "flux";
import { TEventBase, TOrgLight } from "models/Events";
import EventCardTemplate from "templates/Events/EventCard/EventCard.handlebars";
import EventCardMarkerTemplate from "templates/Events/EventCard/EventCardMarker.handlebars";

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
        const userData = store.getState().user.data;

        // const mine: boolean = userData ? userData.id === this.#props.org.id : false;

        const mine = true;

        return EventCardTemplate({
            eventId: this.#props.id,
            img: this.#props.img,
            name: this.#props.name,
            desc: this.#props.description,
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
            mine: mine,
        });
    }
}
