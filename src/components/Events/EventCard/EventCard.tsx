/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { store } from "flux";
import { TOrgLight } from "models/Events";
import { isAuthorized } from "flux/slices/userSlice";
import "./styles.scss";
import { Link } from "components/Common/Link";
import { EventCardMarker } from "./EventCardMarker";

import { SVGInline } from "components/Common/SVGInline";

export interface HoveredImgProps {
    default: string;
    hovered: string;
    alt: string;
}

class TestImg extends Component<{ src: string }> {
    constructor(props: { src: string }) {
        super(props);
    }
    render() {
        return <img className="pointy" src={this.props.src} alt={"alt"} />;
    }
}

export class HoveredImg extends Component<HoveredImgProps, { isHovered: boolean }> {
    constructor(props: HoveredImgProps) {
        super(props);
        this.state = { isHovered: false };

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    handleMouseEnter() {
        console.log("handleMouseEnter");
        this.setState({ isHovered: true });
    }

    handleMouseLeave() {
        console.log("handleMouseLeave");
        this.setState({ isHovered: false });
    }

    render() {
        // this.props.alt === "edit" && console.log("isHovered", this.state.isHovered);
        return (
            // <img
            //     className="pointy"
            //     src={this.state.isHovered ? this.props.hovered : this.props.default}
            //     alt={this.props.alt}
            //     onMouseEnter={this.handleMouseEnter}
            //     onMouseLeave={this.handleMouseLeave}
            // />
            // <SVGInline src="/assets/img/card/like-icon.svg" alt="like"/>
            <div className="flex pointy" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                <TestImg src={this.state.isHovered ? this.props.hovered : this.props.default} />
                <SVGInline className="" src={this.props.default} alt={this.props.alt} />
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
                        <HoveredImg
                            default="/assets/img/card/like-icon.svg"
                            hovered="/assets/img/card/like-icon-hover.svg"
                            alt="like"
                        />
                        <HoveredImg
                            default="/assets/img/card/comment-icon.svg"
                            hovered="/assets/img/card/comment-icon-hover.svg"
                            alt="comment"
                        />
                        <HoveredImg
                            default="/assets/img/card/invite-icon.svg"
                            hovered="/assets/img/card/invite-icon-hover.svg"
                            alt="invite"
                        />
                        {isAuthorized(store.state.user) ? (
                            <Link href={`/editevent/${this.props.id}`} className="flex">
                                <HoveredImg
                                    default="/assets/img/card/edit-icon.svg"
                                    hovered="/assets/img/card/edit-icon-hover.svg"
                                    alt="edit"
                                />
                            </Link>
                        ) : (
                            <img src="/assets/img/card/save-icon.svg" alt="invite" />
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
