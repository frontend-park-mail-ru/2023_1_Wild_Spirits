/** @module Components */

import { VDOM, Component } from "modules/vdom";

import { Link, ProfileLink } from "components/Common/Link";
import { store } from "flux";
import { openFriendsList } from "flux/slices/modalWindowSlice";
import { getUploadsImg } from "modules/getUploadsImg";

export class FriendListCard extends Component {
    #openFriendsList() {
        store.dispatch(openFriendsList());
    }

    render() {
        const friends = store.state.user.currentProfile?.friendsPreview?.map(({ id, name, img }) => ({
            user_id: id,
            name: name,
            avatar: getUploadsImg(img),
        }));

        const generateContent = () => {
            if (friends && friends.length > 0) {
                return friends.map((friend) => {
                    const href = `/profile/${friend.user_id}`;
                    return (
                        <ProfileLink href={href} className="friend-list-card__friends-block__block-item">
                            <img src={friend.avatar} className="friend-list-card__friends-block__avatar" />
                            <span className="black-link">{friend.name}</span>
                        </ProfileLink>
                    );
                });
            }

            const mine = store.state.user.data?.id === store.state.user.currentProfile?.id;

            if (mine) {
                return (
                    <span>
                        У вас пока нет подписок
                        <Link href="#" className="link friend-list-card__friend-button" onClick={this.#openFriendsList}>
                            найти
                        </Link>
                    </span>
                );
            }

            return <span>У этого пользователя нет подписок</span>;
        };

        const content = generateContent();

        return (
            <div className="friend-list-card">
                <Link href="#" onClick={this.#openFriendsList} className="friend-list-card__header link flex">
                    Подписки
                </Link>
                {!store.state.meta.collapsed.profileCollapsed && (
                    <div>
                        <hr />
                        <div className="friend-list-card__friends-block">{content}</div>
                    </div>
                )}
            </div>
        );
    }
}
