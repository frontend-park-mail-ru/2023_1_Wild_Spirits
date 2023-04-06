/** @module Components */

import { Component } from "components/Component";

import FriendListTemplate from "templates/Auth/Profile/FriendList.handlebars";

export class FriendList extends Component {
    constructor(parent: Component) {
        super(parent);
    }

    render() {
        const friends = [
            {
                avatar: "assets/event_test.png",
                nickname: "Никита"
            },
            {
                avatar: "assets/event_test.png",
                nickname: "Никита"
            },
            {
                avatar: "assets/event_test.png",
                nickname: "Никита"
            },
            {
                avatar: "assets/event_test.png",
                nickname: "Никита"
            }
        ]
        return FriendListTemplate({
            friends: friends
        });
    }
}
