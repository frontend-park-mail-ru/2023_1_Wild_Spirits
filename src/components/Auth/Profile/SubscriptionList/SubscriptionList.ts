/** @module Components */

import { Component } from "components/Component";

import SusbscriptionListTemplate from "templates/Auth/Profile/SubscriptionList.handlebars";
import "./styles.scss";

export class SubscriptionList extends Component {
    constructor(parent: Component) {
        super(parent);
    }

    render() {
        const subscriptions = [
            {
                avatar: "assets/event_test.png",
                name: "МГТУ им. Н.Э. Баумана",
            },
            {
                avatar: "assets/event_test.png",
                name: "МГТУ им. Н.Э. Баумана",
            },
            {
                avatar: "assets/event_test.png",
                name: "МГТУ им. Н.Э. Баумана",
            },
            {
                avatar: "assets/event_test.png",
                name: "МГТУ им. Н.Э. Баумана",
            },
        ];

        return SusbscriptionListTemplate({
            subscriptions: subscriptions,
        });
    }
}
