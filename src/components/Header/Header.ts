/** @module Components */

import { Component } from "components/Component";
import config from "config";
import { ajax } from "modules/ajax";
import HeaderTemplate from "templates/Header/Header.handlebars";
import UnauthorizedLinkTemplate from "templates/Auth/ProfileLink/UnauthorizedLink.handlebars";
import AuthorizedLinkTemplate from "templates/Auth/ProfileLink/AuthorizedLink.handlebars";

import { store } from "flux";
import { openLogin, openRegister } from "flux/slices/modalWindowSlice";
import { selectCity, selectCategory, getSelectedCityName, getCitiesNames, clearCategory } from "flux/slices/headerSlice";
import { logout } from "flux/slices/userSlice";
import { loadEvents } from "requests/events";
import { loadCategories, loadCities } from "requests/header";

import { logoutUser } from "requests/user";

/**
 * @class
 * @extends Component
 * Component for navbar
 */
export class Header extends Component {
    constructor(parent: Component) {
        super(parent);

        loadCities();
        loadCategories();

        this.registerEvent(() => document.getElementById("header-city-select"), "change", this.#selectCity);
        this.registerEvent(() => document.getElementsByClassName("header__category"), "click", this.#categoryLinkClick);

        this.registerEvent(
            () => document.getElementById("login-link"),
            "click",
            () => store.dispatch.bind(store)(openLogin())
        );
        this.registerEvent(
            () => document.getElementById("signup-link"),
            "click",
            () => store.dispatch.bind(store)(openRegister())
        );
        this.registerEvent(() => document.getElementById("profile-link-logout"), "click", this.#onLogout);
    }

    #onLogout = () => {
        logoutUser();
    };

    /**
     * handles category selection
     * @param {Event} event
     */
    #categoryLinkClick = (event: PointerEvent) => {
        const target = event.target as HTMLElement;
        const id = target.id.split("-").at(-1);
        if (id !== undefined) {
            const numId = parseInt(id);
            if (store.getState().header.selectedCategoryId === numId) {
                store.dispatch(clearCategory());
            } else {
                store.dispatch(selectCategory({category: numId}));
            }
            loadEvents();
        }  
    };

    /**
     * handles city selection
     * @param {Event} event
     */
    #selectCity = (event: Event) => {
        const target = event.target as HTMLInputElement;
        store.dispatch(selectCity({city: target.value}));
        loadEvents();
    };

    postRender() {
        const select = document.getElementsByTagName("select")[0];
        const selectedCityName = getSelectedCityName(store.getState().header)
        select.value = selectedCityName ? selectedCityName : "";
    }

    render() {
        const userData = store.getState().user.data;

        return HeaderTemplate({
            id: this.id,
            categories: store.getState().header.categories,
            selectedCategoryId: store.getState().header.selectedCategoryId,
            cities: getCitiesNames(store.getState().header),
            profileLink:
                userData !== undefined
                    ? AuthorizedLinkTemplate({
                          name: userData.name,
                          img: config.HOST + userData.img,
                          user_id: userData.id
                      })
                    : UnauthorizedLinkTemplate(),
        });
    }
}
