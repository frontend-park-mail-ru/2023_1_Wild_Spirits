/** @module Components */

import { createTable } from "components/Common/CreateTable";
import { Component } from "components/Component";

import { store } from "flux";
import { setData, setCurrentProfile, kickUnauthorized } from "flux/slices/userSlice";

import ProfileTemplate from "templates/Auth/Profile/Profile.handlebars";
import TableTemplate from "templates/Common/Table.handlebars";
import EditTableTemplate from "templates/Common/EditProfileTable.handlebars";
import { getCitiesNames } from "flux/slices/headerSlice";

import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseUserEdit } from "responses/ResponsesUser";
import { addFriend, loadFriends, loadProfile } from "requests/user";
import { router } from "modules/router";
import { toWebP } from "modules/imgConverter";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { ResponseErrorDefault } from "responses/ResponseBase";
import { requestManager } from "requests";

/**
 * Registration component
 * @class
 * @extends Component
 */
export class Profile extends Component {
    #editing: boolean;
    #tempAvatarUrl: string | undefined;
    #errorMsg: string = "";

    constructor(parent: Component) {
        super(parent);
        this.#editing = false;

        this.registerEvent(
            () => document.getElementById("edit-profile-btn"),
            "click",
            (() => {
                this.#editing = true;
                this.rerender();
            }).bind(this)
        );
        this.registerEvent(() => document.getElementById("edit-profile-form"), "submit", this.#submitForm);
        this.registerEvent(() => document.getElementById("edit-profile-form"), "change", this.#formChanged);
        this.registerEvent(() => document.getElementById("add-friend-btn"), "click", this.#addFriend);
    }

    #formChanged = (event: Event) => {
        let input = event.target as HTMLInputElement;

        if (!input || input.getAttribute("type") !== "file") {
            return;
        }

        const inputFiles = (input as HTMLInputElement).files;

        if (!inputFiles) {
            return;
        }

        const image = inputFiles[0];
        this.#tempAvatarUrl = URL.createObjectURL(image);

        this.rerender();
    };

    getProfileId(): number | undefined {
        const url = router.getNextUrl();
        if (url === undefined) {
            const user_data = store.getState().user.data;
            return user_data !== undefined ? user_data.id : undefined;
        }
        return parseInt(url.slice(1));
    }

    loadProfile() {
        const id = this.getProfileId();

        if (id !== undefined) {
            requestManager.request(loadProfile, id);
        }
    }

    #addFriend = (event: Event) => {
        const id = this.getProfileId();

        if (id !== undefined) {
            requestManager.request(addFriend, id);
        }
    };

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

        let formData = new FormData(form as HTMLFormElement);
        const city_id = store.getState().header.cities.find((city) => city.name === formData.get("city_id"));

        if (!city_id) {
            return;
        }

        formData.set("city_id", city_id.id.toString());

        if (this.#tempAvatarUrl !== undefined) {
            toWebP(this.#tempAvatarUrl, (imageBlob: Blob) => {
                formData.set("avatar", imageBlob);

                this.#sendForm(userData.id, formData);
            });
        } else {
            this.#sendForm(userData.id, formData);
        }
    };

    #sendForm(user_id: number, formData: FormData) {
        ajax.removeHeaders("Content-Type");
        ajax.patch<ResponseUserEdit, ResponseErrorDefault>({
            url: `/users/${user_id}`,
            credentials: true,
            body: formData,
        }).then(({ json, response, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(
                    setData({ ...json.body.user }),
                    setCurrentProfile({ profile: json.body, id: store.getState().user.data!.id })
                );
            } else if (response.status === 409) {
                let errorMsgElement = document.getElementById("profile-description-error-message");
                if (errorMsgElement) {
                    errorMsgElement.textContent = json.errorMsg;
                }
            }
        });
        ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });

        this.#editing = false;
    }

    render() {
        if (kickUnauthorized(store.getState().user)) {
            return "";
        }

        const getTable = (profile_data: {
            id: number;
            name: string;
            img: string;
            email?: string | undefined;
            city_name?: string;
        }) => {
            if (this.#editing) {
                return EditTableTemplate({
                    name: profile_data.name,
                    cities: getCitiesNames(store.getState().header),
                    city: store.getState().user.current_profile,
                });
            }
            return TableTemplate({
                rows: createTable({
                    Имя: profile_data.name,
                    Почта: profile_data.email ? profile_data.email : "не указана",
                    Город: profile_data.city_name ? profile_data.city_name : "Москва",
                }),
            });
        };

        const user_data = store.getState().user.data;
        if (!user_data) {
            return "Вы не авторизованы";
        }

        const profile_data = store.getState().user.current_profile;

        if (!profile_data) {
            return "Такого пользователя не существует";
        }

        return ProfileTemplate({
            avatar: this.#tempAvatarUrl || getUploadsImg(store.getState().user.current_profile!.img),
            table: getTable(profile_data),
            editing: this.#editing,
            mine: user_data.id === profile_data.id,
            isFriend: store.getState().user.current_profile?.is_friend,
            errorMsg: this.#errorMsg,
        });
    }
}
