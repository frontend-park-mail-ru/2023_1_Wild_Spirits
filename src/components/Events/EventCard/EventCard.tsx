/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { store } from "flux";
import { TOrgLight } from "models/Events";
import { isAuthorized } from "flux/slices/userSlice";
import { Link } from "components/Common/Link";
import { EventCardMarker } from "./EventCardMarker";

import { requestManager } from "requests";
import { dislikeEvent, likeEvent, featureEvent, unfeatureEvent } from "requests/events";
import { HoveredImg } from "components/Common/HoveredImg";
import { openInviteModal, openRegister } from "flux/slices/modalWindowSlice";
import { loadFriends } from "requests/user";
import { setInviteModalEventId } from "flux/slices/metaSlice";

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
    is_mine: boolean;
    reminded: boolean;
}

/**
 * event card component
 * @class
 * @extends Component
 */
export class EventCard extends Component<EventCardProps> {
    constructor(props: EventCardProps) {
        super(props);

        this.openInviteModal = this.openInviteModal.bind(this);
    }

    toggleLike(eventId: number, liked: boolean) {
        if (!liked) {
            requestManager.request(likeEvent, eventId);
        } else {
            requestManager.request(dislikeEvent, eventId);
        }
    }

    toggleFeatured(eventId: number, featured: boolean) {
        if (!featured) {
            requestManager.request(featureEvent, eventId);
        } else {
            requestManager.request(unfeatureEvent, eventId);
        }
    }

    openInviteModal() {
        if (store.state.user.data) {
            requestManager.request(loadFriends, store.state.user.data.id);
            store.dispatch(openInviteModal(), setInviteModalEventId(this.props.id));
        } else {
            store.dispatch(openRegister());
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
                                onClick={() => this.toggleLike(this.props.id, this.props.liked)}
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
                        <HoveredImg
                            src="/assets/img/card/invite-icon.svg"
                            alt="invite"
                            iconClassName="stroke-svg-icon"
                            onClick={this.openInviteModal}
                        />
                        {isAuthorized(store.state.user) && this.props.is_mine ? (
                            <Link href={`/editevent/${this.props.id}`} className="flex">
                                <HoveredImg
                                    src="/assets/img/card/edit-icon.svg"
                                    alt="edit"
                                    iconClassName="stroke-svg-icon"
                                />
                            </Link>
                        ) : (
                            <HoveredImg
                                src="/assets/img/card/save-icon.svg"
                                alt="edit"
                                iconClassName={`stroke-svg-icon${this.props.reminded ? " filled" : ""}`}
                                onClick={() => this.toggleFeatured(this.props.id, this.props.reminded)}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
