import { VDOM, Component } from "modules/vdom";
import { store } from "flux";
import { FriendPreviewNoLink } from "components/Auth/Profile/FriendList/FriendPreview";
import { requestManager } from "requests";
import { inviteUserToEvent } from "requests/notifications";
import { SVGInline } from "components/Common/SVGInline";

export class InviteModal extends Component {
    getFriends() {
        if (store.state.friendList.friends === null) {
            return [];
        }

        return store.state.friendList.friends.map(({ id, name, img }) => ({
            user_id: id,
            name: name,
            avatar: img,
        }));
    }

    handleInvite(userId: number) {
        requestManager.request(inviteUserToEvent, userId, store.state.meta.inviteModalEventId);
    }

    render() {
        const users = this.getFriends();
        return (
            <div>
                <div className="modal__title">Пригласить друга</div>
                <div className="invite-modal">
                    {users.length > 0 && (
                        <div className="invite-modal__list">
                            {users.map((user) => (
                                <div className="friend-list__link">
                                    <FriendPreviewNoLink {...user}>
                                        <div
                                            className="transparent-svg-button friend-list__link-invite-block pointy"
                                            onClick={() => this.handleInvite(user.user_id)}
                                        >
                                            <SVGInline
                                                src="/assets/img/invite-icon.svg"
                                                alt="invite"
                                            />
                                        </div>
                                    </FriendPreviewNoLink>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
