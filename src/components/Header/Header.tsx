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
import { openSideMenu } from "flux/slices/sideMenuSlice";
import { openCalendarModal } from "flux/slices/metaSlice";

/**
 * @class
 * @extends Component
 * Component for navbar
 */
export class Header extends Component {
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

        const CityPickerButton = () => {
            return (
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
            </div>
            )
        }

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

                    {
                        !store.state.meta.collapsed.searchCollapsed && 
                        <div className="header__search-container">
                                <input
                                    type="text"
                                    size={1}
                                    onChange={(e) => this.#search(e as unknown as Event)}
                                    placeholder="Поиск"
                                    value={store.state.header.searchQuery}
                                    className="search"
                                />
                            </div>
                    }

                    { !store.state.meta.collapsed.headerCollapsed && <CityPickerButton/> }

                    {
                        store.state.meta.collapsed.headerCollapsed
                        ?   
                            <div className="flex">
                                {
                                    store.state.meta.collapsed.searchCollapsed &&
                                    <button className="header__mobile-button">
                                        <img src="/assets/img/search-icon.svg" className="header__mobile-icon"/>
                                    </button>
                                }
                                <button 
                                    className="header__mobile-button"
                                    onClick={()=>store.dispatch(openCalendarModal())}
                                >
                                    <img src="/assets/img/calendar-icon.svg" className="header__mobile-icon"/>
                                </button>
                                <button
                                    className="header__mobile-button"
                                    onClick={()=>store.dispatch(openSideMenu())}
                                >
                                    <img src="/assets/img/burger-menu-icon.svg" className="header__mobile-icon"/>
                                </button>
                            </div>
                        :   <div className="profile-link">{getProfileLink()}</div>
                    }
                </div>

                { !store.state.meta.collapsed.headerCollapsed && <CategoriesMenu /> }
            </div>
        );
    }
}
