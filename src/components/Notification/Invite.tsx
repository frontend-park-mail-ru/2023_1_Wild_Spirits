import { VDOM, Component } from "modules/vdom";
import { TInvite } from "models/Notification";
import { getUploadsImg } from "modules/getUploadsImg";
import { FriendLink } from "components/Auth/Profile/FriendList/FriendLink";

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
                <div className="invite-card__event">
                    <div>{this.props.invite.eventName}</div>
                    <div className="invite-card__event-img-block">
                        <img
                            src={getUploadsImg(this.props.invite.eventImg)}
                            alt="Event"
                            className="invite-card__event-img"
                        />
                    </div>
                </div>
                <div className="invite-card__user">
                    <FriendLink
                        avatar={getUploadsImg(this.props.invite.userImg)}
                        userId={this.props.invite.userId}
                        name={this.props.invite.userName}
                    />
                </div>
            </div>
        );
    }
}
