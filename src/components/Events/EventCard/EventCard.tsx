/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { store } from "flux";
import { TEvent, TOrgLight } from "models/Events";
import { isAuthorized } from "flux/slices/userSlice";
import "./styles.scss";
import { Link } from "components/Common/Link";
import { EventCardMarker } from "./EventCardMarker";

import { SVGInline } from "components/Common/SVGInline";

import { requestManager } from "requests";
import { dislikeEvent, likeEvent } from "requests/events";

export interface HoveredImgProps {
    src: string;
    alt: string;
    iconClassName: string;
    onClick?: ()=>void;
}

export class HoveredImg extends Component<HoveredImgProps, { isHovered: boolean }> {
    constructor(props: HoveredImgProps) {
        super(props);
        this.state = { isHovered: false };
    }

    render() {
        return (
            <div
                className="flex pointy"
                onClick={() => this.props.onClick ? this.props.onClick() : ()=>{}}
            >
                <SVGInline className={this.props.iconClassName} src={this.props.src} alt={this.props.alt} />
            </div>
        );
    }
}

export interface EventCardProps {
    id: number;
    name: string;
    description: string;
    img: string;
    dates: string[];
    places: string[];
    org: TOrgLight;
    likes: number;
    liked: boolean;
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
    
    toggleLike(eventId: number, liked: boolean) {
        if (!liked) {
            requestManager.request(likeEvent, eventId);
        } else {
            requestManager.request(dislikeEvent, eventId);
        }
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
                            img_src="/assets/img/card/calendar-icon.svg"
                            title="Даты"
                            items={this.props.dates}
                        />
                        <hr className="card__hr" />
                        <EventCardMarker
                            img_src="/assets/img/card/place-icon.svg"
                            title="Места"
                            items={this.props.places}
                        />
                    </div>
                </Link>
                <div className="event-card__footer">
                    <div className="event-card__button-block">
                        <div className="event-card__stats-container">
                            <HoveredImg
                                src="/assets/img/card/like-icon.svg"
                                alt="like"
                                iconClassName={`stroke-svg-icon${this.props.liked ? " filled" : ""}`}
                                onClick={()=>this.toggleLike(this.props.id, this.props.liked)}
                            />
                            <span>{this.props.likes.toString()}</span>
                        </div>
                        {/* <div className="event-card__stats-container">
                            <HoveredImg
                                src="/assets/img/card/comment-icon.svg"
                                alt="comment"
                                iconClassName="event-card__fill-icon"
                            />
                            <span>0</span>
                        </div> */}
                        {/* <HoveredImg
                            src="/assets/img/card/invite-icon.svg"
                            alt="invite"
                            iconClassName="event-card__stroke-icon"
                        /> */}
                        {isAuthorized(store.state.user) ? (
                            <Link href={`/editevent/${this.props.id}`} className="flex">
                                <HoveredImg
                                    src="/assets/img/card/save-icon.svg"
                                    alt="edit"
                                    iconClassName="stroke-svg-icon filled"
                                />
                            </Link>
                        ) : (
                            <HoveredImg
                                src="/assets/img/save-icon.svg"
                                alt="edit"
                                iconClassName="stroke-svg-icon"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
