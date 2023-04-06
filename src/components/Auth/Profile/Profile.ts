/** @module Components */

import { Component } from "components/Component";
import config from "config";

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
                    cols: ["Имя", "Скворцов Никита"]
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
            avatar: config.HOST + "/uploads/img/default.png",
            table: TableTemplate({
                rows: description.rows
            })
        });
    }
}
