/** @module Components */

import { VDOM, Component } from "modules/vdom";

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
import { openCitySelector } from "flux/slices/modalWindowSlice";

import { logoutUser } from "requests/user";
import { getUploadsImg } from "modules/getUploadsImg";
import { requestManager } from "requests/index";
import { Link, ProfileLink } from "components/Common/Link";
import { CategoriesMenu } from "./CategoriesMenu";

/**
 * @class
 * @extends Component
 * Component for navbar
 */
export class Header extends Component<any> {
    constructor() {
        super({});
    }

    didCreate(): void {
        requestManager.request(loadCities);
        requestManager.request(loadCategories);
    }

    #onLogout = () => {
        requestManager.request(logoutUser);
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

    render() {
        const getProfileLink = () => {
            const userData = store.state.user.data;

            if (userData !== undefined) {
                return (
                    <div className="profile-link">
                        <ProfileLink
                            id="profile-link"
                            className="profile-link__profile-block link"
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
                        </ProfileLink>
                        <div id="profile-link-logout">
                            <img
                                className="profile-link__logout-img"
                                src="/assets/img/logout.png"
                                onClick={this.#onLogout}
                            />
                        </div>
                    </div>
                );
            }

            return [
                <a className="link" onClick={() => store.dispatch(openLogin())}>
                    Вход
                </a>,
                "/",
                <a className="link" onClick={() => store.dispatch(openRegister())}>
                    Регистрация
                </a>,
            ];
        };

        const cities = getCitiesNames(store.state.header).map((cityName) => <option>{cityName}</option>);

        const selectedCityName = getSelectedCityName(store.state.header);

        return (
            <div className="header">
                <div className="header__logo">
                    <img src="/assets/img/logo-full.svg" alt="logo" />
                </div>

                <div className="header__top__line">
                    <div className="header__head">
                        <Link href="/" className="js-router-link black-link">
                            Event Radar
                        </Link>
                    </div>

                    <div className="header__search-container">
                        <input
                            type="text"
                            onChange={(e) => this.#search(e as unknown as Event)}
                            placeholder="Поиск"
                            value={store.state.header.searchQuery}
                            className="search"
                        />
                    </div>

                    <div className="header__city-selector">
                        <button
                            className="header__city-selector__button"
                            onClick={() => {
                                store.dispatch(openCitySelector());
                            }}
                        >
                            <img src="/assets/img/geo-icon.svg"></img>
                            <span>{selectedCityName}</span>
                        </button>
                        {/* <select onChange={(e) => this.#selectCity(e as unknown as Event)}>{cities}</select> */}
                    </div>

                    <div className="profile-link">{getProfileLink()}</div>
                </div>

                <CategoriesMenu />
            </div>
        );
    }
}
