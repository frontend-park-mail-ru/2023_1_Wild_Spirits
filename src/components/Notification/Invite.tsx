import { VDOM, Component } from "modules/vdom";
import { TInvite } from "models/Notification";
import { getUploadsImg } from "modules/getUploadsImg";
import { FriendLink } from "components/Auth/Profile/FriendList/FriendLink";
import { Link } from "components/Common/Link";
import { store } from "flux";
import { closeModal } from "flux/slices/modalWindowSlice";
import { SVGInline } from "components/Common/SVGInline";
import { requestManager } from "requests";
import { acceptInvitation, declineInvitation } from "requests/notifications";

export interface InviteProps {
    invite: TInvite;
}

export class Invite extends Component<InviteProps> {
    constructor(props: InviteProps) {
        super(props);
    }

    render() {
        return (
            <div className="invite-card">
                <div className="invite-card__user">
                    <FriendLink
                        avatar={getUploadsImg(this.props.invite.userImg)}
                        userId={this.props.invite.userId}
                        name={this.props.invite.userName}
                        onClick={() => store.dispatch(closeModal())}
                    />
                </div>
                <div className="invite-card__event">
                    <div className="invite-card__event-text">
                        <Link
                            className="link"
                            href={`/events/${this.props.invite.eventId}`}
                            onClick={() => store.dispatch(closeModal())}
                        >
                            {this.props.invite.eventName}
                        </Link>
                        <div className="invite-card__resolve-block">
                            <button
                                className="transparent-svg-button"
                                onClick={() =>
                                    requestManager.request(
                                        acceptInvitation,
                                        this.props.invite.userId,
                                        this.props.invite.eventId
                                    )
                                }
                            >
                                <SVGInline className="accept-icon" src="/assets/img/tick-icon.svg" alt="Принять" />
                            </button>
                            <button
                                className="transparent-svg-button"
                                onClick={() =>
                                    requestManager.request(
                                        declineInvitation,
                                        this.props.invite.userId,
                                        this.props.invite.eventId
                                    )
                                }
                            >
                                <SVGInline className="decline-icon" src="/assets/img/close-icon.svg" alt="Отклонить" />
                            </button>
                        </div>
                    </div>
                    <Link
                        className="invite-card__event-img-block link"
                        href={`/events/${this.props.invite.eventId}`}
                        onClick={() => store.dispatch(closeModal())}
                    >
                        <img
                            src={getUploadsImg(this.props.invite.eventImg)}
                            alt="Event"
                            className="invite-card__event-img"
                        />
                    </Link>
                </div>
            </div>
        );
    }
}
