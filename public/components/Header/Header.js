/** @module Components */

import { Component } from "/components/Component.js";
import HeaderTemplate from "/compiled/Header/Header.handlebars.js";
import UnauthorizedLinkTemplate from "/compiled/Auth/ProfileLink/UnauthorizedLink.handlebars.js";
import AuthorizedLinkTemplate from "/compiled/Auth/ProfileLink/AuthorizedLink.handlebars.js";

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

    #cities;

    #getUserData;

    constructor(parent, onLogin, onSignup, getUserData) {
        super(parent);

        this.#getUserData = getUserData;

        this.#onLogin = onLogin;
        this.#onSignup = onSignup;

        // this.#selectedCategoryId;

        this.#cities = ["Москва", "Санкт-Петербург", "Нижний Новгород"];
        this.#selectedCity = this.#cities[0];

        this.registerEvent(() => document.getElementsByTagName("select")[0], "change", this.#selectCity);
        this.registerEvent(() => document.getElementsByClassName("header__category"), "click", this.#categoryLinkClick);

        this.registerEvent(() => document.getElementById("login-link"), "click", this.#onLogin);
        this.registerEvent(() => document.getElementById("signup-link"), "click", this.#onSignup);
    }

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
            profileLink: this.#getUserData() ? AuthorizedLinkTemplate(this.#getUserData()) : UnauthorizedLinkTemplate(),
        });
    }
}
