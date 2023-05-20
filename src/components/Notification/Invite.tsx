import { VDOM, Component } from "modules/vdom";
import { TInvite } from "models/Notification";
import { getUploadsImg } from "modules/getUploadsImg";
import { FriendLink } from "components/Auth/Profile/FriendList/FriendLink";
import { Link } from "components/Common/Link";
import { store } from "flux";
import { closeModal } from "flux/slices/modalWindowSlice";
import { SVGInline } from "components/Common/SVGInline";

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
                        onClick={()=>{store.dispatch(closeModal()); console.log('close')}}
                    />
                </div>
                <Link
                    className="invite-card__event link"
                    href={`/events/${this.props.invite.eventId}`}
                    onClick={()=>store.dispatch(closeModal())}
                >
                    <div className="invite-card__event-text">
                        <div>
                            {this.props.invite.eventName}
                        </div>
                        <div className="invite-card__resolve-block">
                            <button className="transparent-svg-button">
                                <SVGInline
                                    src="/assets/img/tick-icon.svg"
                                    alt="Принять"
                                />
                            </button>
                            <button className="transparent-svg-button">
                                <SVGInline
                                    className="decline-icon"
                                    src="/assets/img/close-icon.svg"
                                    alt="Отклонить"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="invite-card__event-img-block">
                        <img
                            src={getUploadsImg(this.props.invite.eventImg)}
                            alt="Event"
                            className="invite-card__event-img"
                        />
                    </div>
                </Link>
            </div>
        );
    }
}
