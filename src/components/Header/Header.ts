/** @module Components */

import { Component } from "components/Component";
import config from "config";
import { ajax } from "modules/ajax";
import HeaderTemplate from "templates/Header/Header.handlebars";
import UnauthorizedLinkTemplate from "templates/Auth/ProfileLink/UnauthorizedLink.handlebars";
import AuthorizedLinkTemplate from "templates/Auth/ProfileLink/AuthorizedLink.handlebars";

import { store } from "flux";
import { openLogin, openRegister } from "flux/slices/modalWindowSlice";
import { setCity, setCategory, getCity } from "flux/slices/headerSlice";
import { logout } from "flux/slices/userSlice";

/**
 * @class
 * @extends Component
 * Component for navbar
 */
export class Header extends Component {
    constructor(parent: Component) {
        super(parent);
        this.registerEvent(() => document.getElementsByTagName("select")[0], "change", this.#selectCity);
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
        ajax.post({
            url: "/logout",
            credentials: true,
        })
            .then(({ json, response }) => {
                if (response.ok) {
                    console.log(response.status, json);
                    ajax.removeHeaders("x-csrf-token");
                    store.dispatch(logout());
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
        const target = event.target as HTMLElement;
        const id = target.id.split("-").at(-1);
        if (id !== undefined) {
            store.dispatch(setCategory({category: parseInt(id)}));
            this.rerender();
        }
    };

    /**
     * handles city selection
     * @param {Event} event
     */
    #selectCity = (event: Event) => {
        const target = event.target as HTMLInputElement;
        store.dispatch(setCity({city: target.value}));
    };

    postRender() {
        const select = document.getElementsByTagName("select")[0];
        select.value = getCity(store.getState().header);
    }

    render() {
        const userData = store.getState().user.data;

        return HeaderTemplate({
            id: this.id,
            categories: store.getState().header.categories,
            selectedCategoryId: store.getState().header.selectedCategoryId,
            cities: store.getState().header.cities,
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
