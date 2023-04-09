/** @module Components */

import { Component } from "components/Component";

import { store } from "flux";

import FriendListTemplate from "templates/Auth/Profile/FriendList.handlebars";
import config from "config";

export class FriendList extends Component {
    constructor(parent: Component) {
        super(parent);
    }

    render() {
        const friends = store.getState().user.current_profile?.friends?.map(({id, name, img}) => ({
            user_id: id,
            name: name,
            avatar: config.HOST + img
        }));

        return FriendListTemplate({
            friends: friends
        });
    }
}
