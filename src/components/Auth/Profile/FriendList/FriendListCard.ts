/** @module Components */

import { Component } from "components/Component";

import { requestManager } from "requests";

import { store } from "flux";
import { openFriendsList } from "flux/slices/modalWindowSlice";

import FriendListCardTemplate from "templates/Auth/Profile/FriendListCard.handlebars";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { loadFriends } from "requests/user";

export class FriendListCard extends Component {
    constructor(parent: Component) {
        super(parent);

        this.registerEvent(() => document.getElementById("friends-list-link"), "click", this.#onLinkClick);
        this.registerEvent(() => document.getElementById("findFriends"), "click", this.#openFriendsList);
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

        const mine = store.getState().user.data?.id === store.getState().user.currentProfile?.id;

        return FriendListCardTemplate({
            friends: friends,
            mine: mine,
        });
    }
}
