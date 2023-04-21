/** @module Components */

import { createVNode, Component } from "modules/vdom";

import { store } from "flux";
import { openLogin, openRegister } from "flux/slices/modalWindowSlice";
import {
    selectCity,
    selectCategory,
    getSelectedCityName,
    getCitiesNames,
    clearCategory,
    setSearchQuery,
} from "flux/slices/headerSlice";
import { loadEvents } from "requests/events";
import { loadCategories, loadCities } from "requests/header";

import { logoutUser } from "requests/user";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { requestManager } from "requests/index";

/**
 * @class
 * @extends Component
 * Component for navbar
 */
export class Header extends Component<any> {
    constructor() {
        super({});

        // this.registerEvent(() => document.getElementById("header-city-select"), "change", this.#selectCity);
        // this.registerEvent(() => document.getElementsByClassName("header__category"), "click", this.#categoryLinkClick);

        // this.registerEvent(() => document.getElementById("header-search"), "change", this.#search);

        // this.registerEvent(
        //     () => document.getElementById("login-link"),
        //     "click",
        //     () => store.dispatch.bind(store)(openLogin())
        // );
        // this.registerEvent(
        //     () => document.getElementById("signup-link"),
        //     "click",
        //     () => store.dispatch.bind(store)(openRegister())
        // );
        // this.registerEvent(() => document.getElementById("profile-link-logout"), "click", this.#onLogout);
    }

    didCreate(): void {
        requestManager.request(loadCities);
        requestManager.request(loadCategories);
    }

    #onLogout = () => {
        requestManager.request(logoutUser);
    };

    #categoryLinkClick = (categoryId: number) => {
        if (store.getState().header.selectedCategoryId === categoryId) {
            store.dispatch(clearCategory());
        } else {
            store.dispatch(selectCategory({ category: categoryId }));
        }
        requestManager.request(loadEvents);
    };

    /**
     * handles city selection
     * @param {Event} event
     */
    #selectCity = (event: Event) => {
        const target = event.target as HTMLInputElement;
        store.dispatch(selectCity({ city: target.value }));
        requestManager.request(loadEvents);
    };

    #search = (event: Event) => {
        const searchInput = event.target as HTMLInputElement;

        if (!searchInput) {
            return;
        }

        store.dispatch(setSearchQuery(searchInput.value));
        requestManager.request(loadEvents);
    };

    // postRender() {
    //     const select = document.getElementsByTagName("select")[0];
    //     const selectedCityName = getSelectedCityName(store.getState().header);
    //     select.value = selectedCityName ? selectedCityName : "";
    // }

    render() {
        const getProfileLink = () => {
            const userData = store.getState().user.data;

            if (userData !== undefined) {
                return (
                    <div className="profile-link">
                        <a
                            id="profile-link"
                            className="js-router-link link profile-link__profile-block"
                            href={`/profile/${userData.id}`}
                        >
                            <div className="profile-link__img-block">
                                <img
                                    className="profile-link__img"
                                    src={getUploadsImg(userData.img)}
                                    alt="ProfileLink"
                                />
                            </div>
                            <div className="profile-link__name-block">{userData.name}</div>
                        </a>
                        <div id="profile-link-logout">
                            <img className="profile-link__logout-img" src="/assets/img/logout.png" />
                        </div>
                    </div>
                );
            }

            return [
                <a id="login-link" className="link">
                    Вход
                </a>,
                "/",
                <a id="signup-link" className="link">
                    Регистрация
                </a>,
            ];
        };

        const createCategories = (categories: string[]) => {
            let res = [];
            for (const [id, categoryName] of categories.entries()) {
                const isSelected = id === store.getState().header.selectedCategoryId;
                res.push(
                    <a
                        onClick={() => this.#categoryLinkClick(id)}
                        className={"header__category" + (isSelected ? " category-selected" : "")}
                    >
                        {categoryName}
                    </a>
                );
                if (id < categories.length - 1) {
                    res.push(<div className="header__category__delimiter"></div>);
                }
            }
            return res;
        };

        const cities = getCitiesNames(store.getState().header).map((cityName) => <option>{cityName}</option>);
        const categories = createCategories(store.getState().header.categories);

        return (
            <div className="header">
                <div className="header__logo">
                    <img src="/assets/img/logo-full.svg" alt="logo" />
                </div>

                <div className="header__top__line">
                    <div className="header__head">
                        <a href="/" className="js-router-link black-link">
                            Event Radar
                        </a>
                    </div>

                    <div className="header__city__selector">
                        <select id="header-city-select">{cities}</select>
                    </div>

                    <div>
                        <input
                            type="text"
                            id="header-search"
                            placeholder="Поиск"
                            value={store.getState().header.searchQuery}
                            className="search"
                        />
                    </div>

                    <div className="profile-link">{getProfileLink()}</div>
                </div>

                <div className="header__bottom__line">{categories}</div>
            </div>
        );
    }
}
