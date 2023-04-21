/** @module Components */

import { store } from "flux";
import { TOrgLight } from "models/Events";
import { isAuthorized } from "flux/slices/userSlice";
import EventCardTemplate from "templates/Events/EventCard/EventCard.handlebars";
import EventCardMarkerTemplate from "templates/Events/EventCard/EventCardMarker.handlebars";
import "./styles.scss";
import { createVNode, Component } from "modules/vdom";

export interface EventCardProps {
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
export class EventCard extends Component<EventCardProps> {
    constructor(props: EventCardProps) {
        super(props);
    }

    render() {
        return (
            <div className="card event-card">
                <a
                    id={`event_${this.props.id}`}
                    className="js-router-link event-card__content"
                    href="/events/{{eventId}}"
                >
                    <div className="card__img-block">
                        <img className="card__img" src="{{img}}" alt="{{name}}" />
                    </div>
                    <div className="card__body event-card__body">
                        <div className="card__title">{this.props.name}</div>
                        <div className="card__description">{this.props.description}</div>
                        <hr className="card__hr" />
                        {this.props.dates}
                        <hr className="card__hr" />
                        {this.props.places}
                    </div>
                </a>
                <div className="event-card__footer">
                    <div className="event-card__button-block">
                        <div className="heart-icon-container"></div>
                        <div className="comment-icon-container"></div>
                        <div className="invite-icon-container"></div>
                        {isAuthorized(store.getState().user) ? (
                            <a href="/editevent/{{eventId}}" className="js-router-link edit-link">
                                <div className="edit-icon-container"></div>
                            </a>
                        ) : (
                            <div className="bookmark-icon-container"></div>
                        )}
                    </div>
                </div>
            </div>
        );

        // return EventCardTemplate({
        //     eventId: this.#props.id,
        //     img: this.#props.img,
        //     name: this.#props.name,
        //     desc: this.#props.description,
        //     dates: EventCardMarkerTemplate({
        //         img_src: "/assets/img/calendar_icon.png",
        //         title: "Даты",
        //         items: this.#props.dates,
        //     }),
        //     places: EventCardMarkerTemplate({
        //         img_src: "/assets/img/position_icon.png",
        //         title: "Места",
        //         items: this.#props.places,
        //     }),
        //     mine: isAuthorized(store.getState().user),
        // });
    }
}
