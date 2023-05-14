/** @module Components */

import { VDOM, Component } from "modules/vdom";

import { store } from "flux";
import { openCalendarModal, openLogin, openNotificationModal, openRegister } from "flux/slices/modalWindowSlice";

import { logoutUser } from "requests/user";
import { getUploadsImg } from "modules/getUploadsImg";
import { requestManager } from "requests/index";
import { Link, ProfileLink } from "components/Common/Link";
import { CategoriesMenu } from "./CategoriesMenu";
import { openSideMenu } from "flux/slices/sideMenuSlice";
import { openMobileSearch } from "flux/slices/metaSlice";
import { HeaderSearch } from "./HeaderSearch";
import { CityPickerButton } from "./CityPickerButton";
import { clearCategory, clearSearchQuery } from "flux/slices/headerSlice";
import { clearTags } from "flux/slices/tagsSlice";
import { clearFinishDate, clearStartDate } from "flux/slices/calendarSlice";
import { loadEvents } from "requests/events";
import { setEventsCardsLoadStart } from "flux/slices/eventSlice";
import { HoveredImg } from "components/Common/HoveredImg";

/**
 * @class
 * @extends Component
 * Component for navbar
 */
export class Header extends Component {
    #searchExpand = () => {
        store.dispatch(openMobileSearch());
    };

    render() {
        const getProfileLink = () => {
            const userData = store.state.user.data;

            if (userData !== undefined) {
                return (
                    <div className="profile-link">
                        <HoveredImg
                            alt=""
                            src="/assets/img/notification-icon.svg"
                            iconClassName="notification-icon"
                            onClick={() => store.dispatch(openNotificationModal())}
                        />
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
                                onClick={() => requestManager.request(logoutUser)}
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

        const clearFilters = () => {
            store.dispatch(
                clearCategory(),
                clearSearchQuery(),
                clearTags(),
                clearStartDate(),
                clearFinishDate(),
                setEventsCardsLoadStart()
            );
            requestManager.request(loadEvents);
        };

        return (
            <div className="header">
                <div className="header__logo">
                    <Link href="/" className="black-link" onClick={clearFilters}>
                        <img src="/assets/img/logo-full.svg" alt="logo" />
                    </Link>
                </div>

                <div className="header__top__line">
                    {!store.state.meta.mobileSearch && (
                        <div className="header__head">
                            <Link href="/" className="black-link" onClick={clearFilters}>
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
