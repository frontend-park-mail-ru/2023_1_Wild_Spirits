/** @module Components */

import { createVNode, Component } from "modules/vdom";

import { requestManager } from "requests";

import { Link } from "components/Common/Link";

import { store } from "flux";
import { openFriendsList } from "flux/slices/modalWindowSlice";

import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { loadFriends } from "requests/user";

export class FriendListCard extends Component {
    constructor() {
        super({});

        // this.registerEvent(() => document.getElementById("friends-list-link"), "click", this.#onLinkClick);
        // this.registerEvent(() => document.getElementById("findFriends"), "click", this.#openFriendsList);
    }

    didCreate(): void {
        
    }

    #onLinkClick() {
        const id = store.getState().user.currentProfile?.id;
        if (id === undefined) {
            return;
        }

        const searchName = store.getState().friendList.friendSearchQuery;
        requestManager.request(loadFriends, id, searchName);
        store.dispatch(openFriendsList());
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
                            <Link href={href} className="js-router-link">
                                <img src={friend.avatar} className="friend-list-card__friends-block__avatar"/>
                            </Link>
                            <a href={href} className="black-link js-router-link">{friend.name}</a>
                        </div>
                    )
                })
            }

            const mine = store.getState().user.data?.id === store.getState().user.currentProfile?.id;

            if (mine) {
                return  <span>У вас пока нет друзей <a href="#" className="link" id="findFriends">найти</a></span>;
            }
            
            return <span>У этого пользователя нет друзей</span>
        }

        const content = generateContent();

        return (
            <div className="friend-list-card">
                <Link href="#" id="friends-list-link" className="friend-list-card__header link js-router-link">
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
