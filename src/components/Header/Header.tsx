/** @module Components */

import { VDOM, Component } from "modules/vdom";

import { store } from "flux";
import { openCalendarModal, openLogin, openRegister } from "flux/slices/modalWindowSlice";
import { selectCity, getSelectedCityName } from "flux/slices/headerSlice";
import { loadEvents } from "requests/events";
import { openCitySelector } from "flux/slices/modalWindowSlice";

import { logoutUser } from "requests/user";
import { getUploadsImg } from "modules/getUploadsImg";
import { requestManager } from "requests/index";
import { Link, ProfileLink } from "components/Common/Link";
import { CategoriesMenu } from "./CategoriesMenu";
import { openSideMenu } from "flux/slices/sideMenuSlice";
import { openMobileSearch } from "flux/slices/metaSlice";
import { HeaderSearch } from "./HeaderSearch";

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

    #searchExpand = () => {
        store.dispatch(openMobileSearch());
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
            );
        };

        const selectedCityName = getSelectedCityName(store.state.header);

        return (
            <div className="header">
                <div className="header__logo">
                    <Link href="/" className="black-link">
                        <img src="/assets/img/logo-full.svg" alt="logo" />
                    </Link>
                </div>

                <div className="header__top__line">
                    {!store.state.meta.mobileSearch && (
                        <div className="header__head">
                            <Link href="/" className="black-link">
                                Event Radar
                            </Link>
                        </div>
                    )}

                    {(!store.state.meta.collapsed.searchCollapsed || store.state.meta.mobileSearch) && <HeaderSearch />}

                    {!store.state.meta.collapsed.headerCollapsed && <CityPickerButton />}

                    {store.state.meta.collapsed.headerCollapsed ? (
                        <div className="flex">
                            {store.state.meta.collapsed.searchCollapsed && !store.state.meta.mobileSearch && (
                                <button className="header__mobile-button" onClick={() => this.#searchExpand()}>
                                    <img src="/assets/img/search-icon.svg" className="header__mobile-icon" />
                                </button>
                            )}
                            <button
                                className="header__mobile-button"
                                onClick={() => store.dispatch(openCalendarModal())}
                            >
                                <img src="/assets/img/calendar-icon.svg" className="header__mobile-icon" />
                            </button>
                            <button className="header__mobile-button" onClick={() => store.dispatch(openSideMenu())}>
                                <img src="/assets/img/burger-menu-icon.svg" className="header__mobile-icon" />
                            </button>
                        </div>
                    ) : (
                        <div className="profile-link">{getProfileLink()}</div>
                    )}
                </div>

                {!store.state.meta.collapsed.headerCollapsed && <CategoriesMenu />}
            </div>
        );
    }
}
