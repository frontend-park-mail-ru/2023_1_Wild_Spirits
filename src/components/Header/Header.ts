/** @module Components */

import { Component } from "components/Component";
import config from "config";
import { ajax } from "modules/ajax";
import HeaderTemplate from "templates/Header/Header.handlebars";
import UnauthorizedLinkTemplate from "templates/Auth/ProfileLink/UnauthorizedLink.handlebars";
import AuthorizedLinkTemplate from "templates/Auth/ProfileLink/AuthorizedLink.handlebars";
import { ResponseBody } from "responses/ResponseBase";

import { store } from "flux";
import { openLogin, openRegister } from "flux/slices/modalWindowSlice";
import { setCities, setCategories, selectCity, selectCategory, getSelectedCityName, getCitiesNames, clearCategory, getSelectedCategory } from "flux/slices/headerSlice";
import { logout } from "flux/slices/userSlice";
import { loadEvents } from "requests/events";

/**
 * @class
 * @extends Component
 * Component for navbar
 */
export class Header extends Component {
    constructor(parent: Component) {
        super(parent);

        ajax.get<ResponseBody<{cities: {id: number, name: string}[]}>>({
            url: "/cities",
            credentials: false
        })
            .then(({json, response}) => {
                if (response.ok) {
                    store.dispatch(setCities({cities: json.body!.cities}));
                }
            })
            .catch(error => {
                console.log("catch:", error);
                store.dispatch(setCities({cities: ["Москва", "Санкт-Петербург", "Нижний Новгород"]}));
            });

        ajax.get<ResponseBody<{categories: {id: number, name: string}[]}>>({
            url: "/categories",
            credentials: false
        })
            .then(({json, response}) => {
                if (response.ok) {
                    store.dispatch(setCategories({categories: json.body!.categories}));
                }
            })
            .catch(error => {
                console.log("catch:", error);
                store.dispatch(setCategories({categories: ["Концерты", "Театр", "Кино", "Фестивали", "Выставки"]}))
            });

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
                      })
                    : UnauthorizedLinkTemplate(),
        });
    }
}
