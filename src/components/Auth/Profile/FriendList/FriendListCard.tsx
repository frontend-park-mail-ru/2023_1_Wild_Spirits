/** @module Components */

import { createVNode, Component } from "modules/vdom";

import { Link } from "components/Common/Link";
import { store } from "flux";
import { openFriendsList } from "flux/slices/modalWindowSlice";
import { getUploadsImg } from "modules/getUploadsImg";

export class FriendListCard extends Component {
    constructor() {
        super({});
    }

    #openFriendsList() {
        store.dispatch(openFriendsList());
    }

    render() {
        const friends = store.getState().user.currentProfile?.friendsPreview?.map(({ id, name, img }) => ({
            user_id: id,
            name: name,
            avatar: getUploadsImg(img),
        }));

        const generateContent = () => {
            if (friends && friends.length > 0) {
                return friends.map(friend => {
                    const href = `/profile/${friend.user_id}`;
                    return (
                        <div className="friend-list-card__friends-block__block-item">
                            <Link href={href}>
                                <img src={friend.avatar} className="friend-list-card__friends-block__avatar"/>
                            </Link>
                            <a href={href} className="black-link">{friend.name}</a>
                        </div>
                    )
                })
            }

            const mine = store.getState().user.data?.id === store.getState().user.currentProfile?.id;

            if (mine) {
                return  <span>У вас пока нет друзей <Link href="#" className="link" onClick={this.#openFriendsList}>найти</Link></span>;
            }
            
            return <span>У этого пользователя нет друзей</span>
        }

        const content = generateContent();

        return (
            <div className="friend-list-card">
                <Link href="#" onClick={this.#openFriendsList} className="friend-list-card__header link">
                    Друзья
                </Link>
                <hr/>
                <div className="friend-list-card__friends-block">
                    {content}
                </div>
            </div>
        )
    }
}
