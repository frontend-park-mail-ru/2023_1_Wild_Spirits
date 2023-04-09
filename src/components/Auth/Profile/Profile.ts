/** @module Components */

import { createTable } from "components/Common/CreateTable";
import { Component } from "components/Component";
import config from "config";

import { store } from "flux";

import ProfileTemplate from "templates/Auth/Profile/Profile.handlebars";
import TableTemplate from "templates/Common/Table.handlebars";
import EditTableTemplate from "templates/Common/EditProfileTable.handlebars"
import { getCitiesNames } from "flux/slices/headerSlice";

import { ajax } from "modules/ajax";
import { ResponseUserEdit } from "responses/ResponsesUser";
import { loadProfile } from "requests/user";
import { router } from "modules/router";

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

    getProfileId(): number | undefined {
        const url = router.getNextUrl();
        if (url === undefined) {
            const user_data = store.getState().user.data;
            console.log("user_data:", user_data)
            return user_data !== undefined ? user_data.id : undefined
        }
        return parseInt(url.slice(1));
    }

    loadProfile() {
        const id = this.getProfileId();

        console.log("id:", id)

        if (id !== undefined) {
            loadProfile(id);
        }
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
            // const user_data = store.getState().user.data;
            // if (!user_data) {
            //     return "Вы не авторизованы";
            // }

            const profile_data = store.getState().user.current_profile;

            if (!profile_data) {
                return "Такого пользователя не существует";
            }

            if (this.#editing) {
                return EditTableTemplate({
                    name: profile_data.name,
                    cities: getCitiesNames(store.getState().header),
                    city: store.getState().user.current_profile
                });
            }
            return TableTemplate({
                rows: createTable({
                    Имя: profile_data.name,
                    Почта: profile_data.email ? profile_data.email : "не указана",
                    Город: profile_data.city_name,
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
