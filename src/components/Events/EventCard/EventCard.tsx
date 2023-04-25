/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { store } from "flux";
import { TOrgLight } from "models/Events";
import { isAuthorized } from "flux/slices/userSlice";
import "./styles.scss";
import { Link } from "components/Common/Link";
import { EventCardMarker } from "./EventCardMarker";

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
                <Link id={`event_${this.props.id}`} className="event-card__content" href={`/events/${this.props.id}`}>
                    <div className="card__img-block">
                        <img className="card__img" src={this.props.img} alt={this.props.name} />
                    </div>
                    <div className="card__body event-card__body">
                        <div className="card__title">{this.props.name}</div>
                        <div className="card__description">{this.props.description}</div>
                        <hr className="card__hr" />
                        <EventCardMarker
                            img_src="/assets/img/calendar_icon.png"
                            title="Даты"
                            items={this.props.dates}
                        />
                        <hr className="card__hr" />
                        <EventCardMarker
                            img_src="/assets/img/position_icon.png"
                            title="Места"
                            items={this.props.places}
                        />
                    </div>
                </Link>
                <div className="event-card__footer">
                    <div className="event-card__button-block">
                        <img src="/assets/img/heart-icon.svg" alt="like" />
                        <img src="/assets/img/comment-icon.svg" alt="comment" />
                        <img src="/assets/img/invite-icon.svg" alt="invite" />
                        {isAuthorized(store.state.user) ? (
                            <Link href={`/editevent/${this.props.id}`} className="edit-link">
                                <img src="/assets/img/edit-icon.svg" alt="invite" />
                            </Link>
                        ) : (
                            <img src="/assets/img/bookmark-icon.svg" alt="invite" />
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
