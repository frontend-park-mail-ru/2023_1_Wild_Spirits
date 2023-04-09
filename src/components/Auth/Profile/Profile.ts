/** @module Components */

import { createTable } from "components/Common/CreateTable";
import { Component } from "components/Component";
import config from "config";

import { store } from "flux";

import ProfileTemplate from "templates/Auth/Profile/Profile.handlebars";
import TableTemplate from "templates/Common/Table.handlebars";
import EditTableTemplate from "templates/Common/EditProfileTable.handlebars"
import { getCitiesNames } from "flux/slices/headerSlice";

import { ajax, AjaxMethod } from "modules/ajax";
import { ResponseUserEdit } from "responses/ResponsesUser";

/**
 * Registration component
 * @class
 * @extends Component
 */
export class Profile extends Component {
    #editing: boolean;
    constructor(parent: Component) {
        super(parent);
        this.#editing = false;

        this.registerEvent(() => document.getElementById("edit-profile-btn"), "click", (()=>{this.#editing=true; this.rerender()}).bind(this));
        this.registerEvent(() => document.getElementById("edit-profile-form"), "submit", this.#submitForm)
    }

    #submitForm = (event: SubmitEvent) => {
        event.preventDefault();
        
        const form = event.target;

        if (!form) {
            return;
        }

        const userData = store.getState().user.data;

        if (!userData) {
            return;
        }

        const formData = new FormData(form as HTMLFormElement);

        ajax.patch<ResponseUserEdit>({
            url: `/users/${userData.id}`,
            credentials: true,
            body: {
                name: formData.get("name"),

            }
        })

        this.#editing = false;
        this.rerender();
    }

    render() {
        const getTable = () => {
            if (this.#editing) {
                return EditTableTemplate({
                    cities: getCitiesNames(store.getState().header)
                });
            }
            return TableTemplate({
                rows: createTable({
                    Имя: store.getState().user.data?.name || "",
                    Почта: "nikstarling@gmail.com",
                    Город: "Чебоксары",
                }),
            });
        }

        return ProfileTemplate({
            avatar: config.HOST + store.getState().user.data?.img,
            table: getTable(),
            editing: this.#editing
        });
    }
}
