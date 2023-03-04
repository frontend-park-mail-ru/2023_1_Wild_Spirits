/** @module Components */

import { Component } from "/components/Component.js";
import HeaderTemplate from "/compiled/Header/Header.handlebars.js";
import UnauthorizedLinkTemplate from "/compiled/Auth/ProfileLink/UnauthorizedLink.handlebars.js";
import AuthorizedLinkTemplate from "/compiled/Auth/ProfileLink/AuthorizedLink.handlebars.js";
import config from "/config.js";

/**
 * @class
 * @extends Component
 * Component for navbar
 */
export class Header extends Component {
    #selectedCategoryId;
    #selectedCity;

    #onLogin;
    #onSignup;
    #setUserData;

    #cities;

    #getUserData;

    constructor(parent, onLogin, onSignup, getUserData, setUserData) {
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
        window.ajax
            .post({
                url: "/logout",
                credentials: true,
            })
            .then(({ json, response }) => {
                if (response.ok) {
                    console.log(response.status, json);
                    window.ajax.removeHeaders("x-csrf-token");
                    this.#setUserData(undefined);
                }
            })
            .catch((err) => {
                console.log("catch:", err);
            });
    };

    /**
     * handles category selection
     * @param {Event} event
     */
    #categoryLinkClick = (event) => {
        const id = event.target.id.split("-").at(-1);
        this.#selectedCategoryId = id;
        this.rerender();
    };

    /**
     * handles city selection
     * @param {Event} e
     */
    #selectCity = (e) => {
        this.#selectedCity = e.target.value;
    };

    postRender() {
        const select = document.getElementsByTagName("select")[0];
        select.value = this.#selectedCity;
    }

    render() {
        const categories = ["Концерты", "Театр", "Кино", "Фестивали", "Выставки"];

        return HeaderTemplate({
            id: this.id,
            categories: categories,
            selectedCategoryId: this.#selectedCategoryId,
            cities: this.#cities,
            profileLink: this.#getUserData()
                ? AuthorizedLinkTemplate({
                      name: this.#getUserData().name,
                      img: config.HOST + this.#getUserData().img,
                  })
                : UnauthorizedLinkTemplate(),
        });
    }
}
