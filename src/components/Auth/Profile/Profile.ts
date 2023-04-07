/** @module Components */

import { createTable } from "components/Common/CreateTable";
import { Component } from "components/Component";
import config from "config";

import { store } from "flux";

import ProfileTemplate from "templates/Auth/Profile/Profile.handlebars";
import TableTemplate from "templates/Common/Table.handlebars";

/**
 * Registration component
 * @class
 * @extends Component
 */
export class Profile extends Component {
    constructor(parent: Component) {
        super(parent);
    }

    render() {
        return ProfileTemplate({
            avatar: config.HOST + store.getState().user.data?.img,
            table: TableTemplate({
                rows: createTable({
                    Имя: store.getState().user.data?.name || "",
                    Почта: "nikstarling@gmail.com",
                    Город: "Чебоксары",
                }),
            }),
        });
    }
}
