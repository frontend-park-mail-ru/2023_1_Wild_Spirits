/** @module Components */

import { createVNode, Component } from "modules/vdom";

import { Link } from "components/Common/Link";
import { requestManager } from "requests";
import { loadFriends } from "requests/user";

import { store } from "flux";
import { close } from "flux/slices/modalWindowSlice";
import { router } from "modules/router";

import { getUploadsImg } from "modules/getUploadsImg";
import { setFriendSearchQuery } from "flux/slices/friendsListSlice";

export class FriendList extends Component {
    constructor() {
        super({});
    }

    didCreate() {
        const id = store.getState().user.currentProfile?.id;

        if (id === undefined) {
            return;
        }

        const searchName = store.getState().friendList.friendSearchQuery;
        requestManager.request(loadFriends, id, searchName);
    }

    #reload = (event: Event) => {
        const input = event.target as HTMLInputElement;

        if (!input) {
            return;
        }

        const searchName = input.value;
        const id = store.getState().user.currentProfile?.id;
        if (id === undefined) {
            return;
        }

        store.dispatch(setFriendSearchQuery(searchName));
        requestManager.request(loadFriends, id, searchName);
    };

    render(): JSX.Element {
        const friends = store.getState().friendList.friends.map(({ id, name, img }) => ({
            user_id: id,
            name: name,
            avatar: getUploadsImg(img),
        })).map(friend => {
            return (
                <div className="friend-list__item">
                    <Link href={`/profile/${friend.user_id}`} onClick={() => store.dispatch.bind(store)(close())}>
                        <div className="friend-list__item__avatar-block">
                            <img className="friend-list__item__avatar" src={friend.avatar}/>
                            <div className="friend-list__item__description">
                                <span className="friend-list__item__friend-name">
                                    {friend.name}
                                </span>
                            </div>
                        </div>            
                    </Link>
                    <div className="tick-friend-icon-container"></div>
                </div>
            )
        })

        return (
            <div>
                <h2 className="friend-list__title">Друзья</h2>

                <input type="text" onChange={(e)=>this.#reload(e as unknown as Event)} className="search friend-search" placeholder="Поиск"
                    value={store.getState().friendList.friendSearchQuery}/>

                <div className="friend-list">
                    {friends}
                </div>
            </div>
        )
    }
}
