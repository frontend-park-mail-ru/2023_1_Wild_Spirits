/** @module Components */

import { Component } from "components/Component";
import config from "config";

import { store } from "flux";

import ProfileTemplate from "templates/Auth/Profile/Profile.handlebars";
import TableTemplate from "templates/Common/Table.handlebars"

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
        const description = {
            rows: [
                {
                    cols: ["Имя", store.getState().user.data?.name]
                },
                {
                    cols: ["Почта", "nikstarling@gmail.com"]
                },
                {
                    cols: ["Город", "Чебоксары"]
                }
            ]
        }

        return ProfileTemplate({
            avatar: config.HOST + store.getState().user.data?.img,
            table: TableTemplate({
                rows: description.rows
            })
        });
    }
}
