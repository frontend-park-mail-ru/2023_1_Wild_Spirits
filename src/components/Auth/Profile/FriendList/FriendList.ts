/** @module Components */

import { Component } from "components/Component";

import { requestManager } from "requests";
import { loadFriends } from "requests/user";

import { store } from "flux";

import FriendListTemplate from "templates/Auth/Profile/FriendList.handlebars";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { setFriendSearchQuery } from "flux/slices/friendsListSlice";

export class FriendList extends Component {
    constructor(parent: Component) {
        super(parent);

        this.registerEvent(() => document.getElementById("friend-search"), "change", this.#reload);
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

    render() {
        const friends = store.getState().friendList.friends.map(({ id, name, img }) => ({
            user_id: id,
            name: name,
            avatar: getUploadsImg(img),
        }));

        return FriendListTemplate({
            friends: friends?.concat(friends),
            friendSearchQuery: store.getState().friendList.friendSearchQuery,
        });
    }
}
