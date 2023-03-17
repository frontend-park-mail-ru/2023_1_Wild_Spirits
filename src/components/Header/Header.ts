/** @module Components */

import { Component } from "components/Component";
import config from "config";
import { ajax } from "modules/ajax";
import { SetUserDataFunc } from "components/Auth/AuthModalProps";
import { TUserAvailable } from "models/User";

// @ts-ignore
import HeaderTemplate from "templates/Header/Header.handlebars";
// @ts-ignore
import UnauthorizedLinkTemplate from "templates/Auth/ProfileLink/UnauthorizedLink.handlebars";
// @ts-ignore
import AuthorizedLinkTemplate from "templates/Auth/ProfileLink/AuthorizedLink.handlebars";

/**
 * @class
 * @extends Component
 * Component for navbar
 */
export class Header extends Component {
    #selectedCategoryId: number | undefined = undefined;
    #selectedCity;

    #onLogin;
    #onSignup;
    #setUserData;

    #cities;

    #getUserData;

    constructor(
        parent: Component,
        onLogin: () => void,
        onSignup: () => void,
        getUserData: () => TUserAvailable,
        setUserData: SetUserDataFunc
    ) {
        super(parent);

        this.#getUserData = getUserData;

        this.#onLogin = onLogin;
        this.#onSignup = onSignup;
        this.#setUserData = setUserData;

        this.#cities = ["Москва", "Санкт-Петербург", "Нижний Новгород"];
        this.#selectedCity = this.#cities[0];

        this.registerEvent(() => document.getElementsByTagName("select")[0], "change", this.#selectCity);
        this.registerEvent(() => document.getElementsByClassName("header__category"), "click", this.#categoryLinkClick);

        this.registerEvent(() => document.getElementById("login-link"), "click", this.#onLogin);
        this.registerEvent(() => document.getElementById("signup-link"), "click", this.#onSignup);
        this.registerEvent(() => document.getElementById("profile-link-logout"), "click", this.#onLogout);
    }

    #onLogout = () => {
        ajax.post({
            url: "/logout",
            credentials: true,
        })
            .then(({ json, response }) => {
                if (response.ok) {
                    console.log(response.status, json);
                    ajax.removeHeaders("x-csrf-token");
                    this.#setUserData({ userData: undefined });
                }
            })
            .catch((error) => {
                console.log("catch:", error);
            });
    };

    /**
     * handles category selection
     * @param {Event} event
     */
    #categoryLinkClick = (event: PointerEvent) => {
        console.log("categoryLinkClick: ", typeof event, event);
        const target = event.target as HTMLElement;
        const id = target.id.split("-").at(-1);
        if (id !== undefined) {
            this.#selectedCategoryId = parseInt(id);
            this.rerender();
        }
    };

    /**
     * handles city selection
     * @param {Event} event
     */
    #selectCity = (event: Event) => {
        const target = event.target as HTMLInputElement;
        this.#selectedCity = target.value;
    };

    postRender() {
        const select = document.getElementsByTagName("select")[0];
        select.value = this.#selectedCity;
    }

    render() {
        const categories = ["Концерты", "Театр", "Кино", "Фестивали", "Выставки"];
        const userData = this.#getUserData();

        return HeaderTemplate({
            id: this.id,
            categories: categories,
            selectedCategoryId: this.#selectedCategoryId,
            cities: this.#cities,
            profileLink:
                userData !== undefined
                    ? AuthorizedLinkTemplate({
                          name: userData.name,
                          img: config.HOST + userData.img,
                      })
                    : UnauthorizedLinkTemplate(),
        });
    }
}
