/** @module Components */

import { createVNode as cvn, Component } from "modules/vdom";
const createVNode = cvn;

import { store } from "flux";
import { TOrgLight } from "models/Events";
import { isAuthorized } from "flux/slices/userSlice";
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
export class EventCard extends Component<EventCardProps> {
    constructor(props: EventCardProps) {
        super(props);
    }

    render(): JSX.Element {
        const eventCardMarker = (items: string[], img_src: string, title: string) => {
            return (
                <div className="event-card__marked">
                    <div className="event-card__logo-block">
                        <img className="event-card__logo" src={img_src} alt={title} />
                    </div>
                    <div className="event-card__marked-text-block">
                        {items.map(item => (
                            <div className="event-card__marked-text">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        const eventBtn = () => {
            if (isAuthorized(store.getState().user)) {
                return (
                    <a href={`/editevent/${this.props.id}`} className="js-router-link edit-link">
                        <div className="edit-icon-container"></div>
                    </a>
                )
            }

            return <div className="bookmark-icon-container"></div>;
        }

        return (
            <div className="card event-card">
                <a id={`event_${this.props.id}`} className="js-router-link event-card__content" href={`/events/${this.props.id}`}>
                    <div className="card__img-block">
                        <img className="card__img" src={this.props.img} alt={this.props.name} />
                    </div>
                    <div className="card__body event-card__body">
                        <div className="card__title">
                            {this.props.name}
                        </div>
                        <div className="card__description">
                            {this.props.description}
                        </div>
                        <hr className="card__hr" />
                        {eventCardMarker(
                            this.props.dates,
                            "/assets/img/calendar_icon.png",
                            "Даты"
                        )}
                        <hr className="card__hr" />
                        {eventCardMarker(
                            this.props.places,
                            "/assets/img/position_icon.png",
                            "Места"
                        )}
                    </div>
                </a>
                <div className="event-card__footer">
                    <div className="event-card__button-block">
                        <div className="heart-icon-container"></div>
                        <div className="comment-icon-container"></div>
                        <div className="invite-icon-container"></div>

                        {eventBtn()}
                    </div>
                </div>
            </div>
        );
    }
}
