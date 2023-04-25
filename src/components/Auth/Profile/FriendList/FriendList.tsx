/** @module Components */

import { createVNode, Component } from "modules/vdom";

import { requestManager } from "requests";
import { loadFriends } from "requests/user";

import { store } from "flux";

// import FriendListTemplate from "templates/Auth/Profile/FriendList.handlebars";
// import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { setFriendSearchQuery } from "flux/slices/friendsListSlice";

export class FriendList extends Component {
    constructor() {
        super({});

        // this.registerEvent(() => document.getElementById("friend-search"), "change", this.#reload);
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
                    <a href={`/profile/${friend.user_id}`} className="black-link js-router-link modalClosing">
                        <div className="friend-list__item__avatar-block">
                            <img className="friend-list__item__avatar" src={friend.avatar}/>
                            <div className="friend-list__item__description">
                                <span className="friend-list__item__friend-name">
                                    {friend.name}
                                </span>
                            </div>
                        </div>            
                    </a>
                    <div className="tick-friend-icon-container"></div>
                </div>
            )
        })

        // return FriendListTemplate({
        //     friends: friends?.concat(friends),
        //     friendSearchQuery: store.getState().friendList.friendSearchQuery,
        // });


        return (
            <div>
                <h2 className="friend-list__title">Друзья</h2>

                <input type="text" id="friend-search" className="search friend-search" placeholder="Поиск" value="{{friendSearchQuery}}"/>

                <div className="friend-list">
                    {/* {{#each friends}} */}
                    {friends}
                    {/* {{/each}} */}
                </div>
            </div>
        )
    }
}
