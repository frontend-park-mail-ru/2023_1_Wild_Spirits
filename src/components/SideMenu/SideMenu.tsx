import { VDOM, Component } from "modules/vdom";

import { SVGInline } from "components/Common/SVGInline";
import { store } from "flux";
import {
    closeSideMenuCategories,
    openSideMenuCategories,
    closeSideMenu,
    closeSideMenuCities,
    openSideMenuCities,
    closeSideMenuTags,
    openSideMenuTags,
} from "flux/slices/sideMenuSlice";
import {
    TCity,
    clearCategory,
    getSelectedCategory,
    getSelectedCityName,
    selectCategory,
    selectCity,
} from "flux/slices/headerSlice";
import { TCategory } from "models/Category";
import { requestManager } from "requests";
import { loadEvents } from "requests/events";
import { logoutUser } from "requests/user";
import { ProfileLink, Link } from "components/Common/Link";

import { Tags } from "components/Tags/Tags";
import { toggleTag } from "flux/slices/tagsSlice";
import { openLogin, openRegister } from "flux/slices/modalWindowSlice";
import { setEventsCardsLoadStart } from "flux/slices/eventSlice";

export class SideMenu extends Component {
    toggleCategories() {
        if (store.state.sideMenu.categoriesOpen) {
            store.dispatch(closeSideMenuCategories());
        } else {
            store.dispatch(openSideMenuCategories());
        }
    }

    toggleCities() {
        if (store.state.sideMenu.citiesOpen) {
            store.dispatch(closeSideMenuCities());
        } else {
            store.dispatch(openSideMenuCities());
        }
    }

    toggleTags() {
        if (store.state.sideMenu.tagsOpen) {
            store.dispatch(closeSideMenuTags());
        } else {
            store.dispatch(openSideMenuTags());
        }
    }

    render() {
        type TabProps = {
            name: string;
            open: boolean;
            toggleFunc: () => void;
            children?: JSX.Element[] | JSX.Element | string;
        };

        const SideMenuTab = (props: TabProps) => {
            return (
                <div className={"sidemenu__tab" + (props.open ? " open" : "")}>
                    <button
                        className={"sidemenu__tab__button header__mobile-button" + (props.open ? " open" : "")}
                        onClick={props.toggleFunc}
                    >
                        <span>{props.name}</span>
                        <div className="header__mobile-button">
                            <SVGInline
                                src="/assets/img/down-arrow-icon.svg"
                                alt=""
                                className={"sidemenu__arrow" + (props.open ? "" : " closed")}
                            />
                        </div>
                    </button>
                    {props.open && (
                        <div className="sidemenu__tab__content">
                            {Array.isArray(props.children)
                                ? props.children.map((child) => child).flat()
                                : props.children}
                        </div>
                    )}
                </div>
            );
        };

        const createCategoryTab = (category: TCategory) => {
            const selectedCategory = getSelectedCategory(store.state.header);
            const selected = selectedCategory !== undefined && selectedCategory.id === category.id;
            return (
                <button
                    className={"sidemenu__tab__item" + (selected ? " selected" : "")}
                    onClick={() => {
                        if (selected) {
                            store.dispatch(clearCategory(), setEventsCardsLoadStart());
                        } else {
                            store.dispatch(selectCategory(category.id), setEventsCardsLoadStart());
                        }
                        requestManager.request(loadEvents);
                    }}
                >
                    {category.name}
                </button>
            );
        };

        const selectedCityId = store.state.header.selectedCityId;

        const createCityTab = (city: TCity) => {
            const selected = city.id === selectedCityId;
            return (
                <button
                    className={"sidemenu__tab__item" + (selected ? " selected" : "")}
                    onClick={() => {
                        store.dispatch(selectCity({ city }), setEventsCardsLoadStart());
                        requestManager.request(loadEvents);
                    }}
                >
                    {city.name}
                </button>
            );
        };

        const categories = store.state.header.categories.map(createCategoryTab);

        const cities = store.state.header.cities.map(createCityTab);

        return (
            <div className="sidemenu">
                <div className="sidemenu__header">
                    <button className="header__mobile-button" onClick={() => store.dispatch(closeSideMenu())}>
                        <img src="/assets/img/close-icon.svg" />
                    </button>
                </div>
                <div className="sidemenu__content">
                    <div className="sidemenu__tab__button">
                        {store.state.user.data !== undefined ? (
                            <ProfileLink
                                href={`/profile/${store.state.user.data?.id}`}
                                className="sidemenu__link"
                                onClick={() => store.dispatch(closeSideMenu())}
                            >
                                Профиль
                            </ProfileLink>
                        ) : (
                            [
                                <a className="link" onClick={() => store.dispatch(openLogin())}>
                                    Вход
                                </a>,
                                "/",
                                <a className="link" onClick={() => store.dispatch(openRegister())}>
                                    Регистрация
                                </a>,
                            ]
                        )}
                    </div>

                    <SideMenuTab
                        name="Категории"
                        open={store.state.sideMenu.categoriesOpen}
                        toggleFunc={this.toggleCategories}
                    >
                        {categories}
                    </SideMenuTab>

                    <SideMenuTab
                        name={getSelectedCityName(store.state.header) || "Москва"}
                        open={store.state.sideMenu.citiesOpen}
                        toggleFunc={this.toggleCities}
                    >
                        {cities}
                    </SideMenuTab>

                    <SideMenuTab name="Теги" open={store.state.sideMenu.tagsOpen} toggleFunc={this.toggleTags}>
                        <Tags
                            tagsState={store.state.tags}
                            classPrefix="mobile"
                            toggleTag={(tag) => {
                                store.dispatch(toggleTag(tag), setEventsCardsLoadStart());
                                requestManager.request(loadEvents);
                            }}
                        />
                    </SideMenuTab>

                    <div className="sidemenu__tab__button">
                        <Link href="/map" className="sidemenu__link">
                            Поиск по карте
                        </Link>
                    </div>
                </div>

                {store.state.user.data !== undefined && (
                    <div className="sidemenu__footer">
                        <div id="profile-link-logout" onClick={() => requestManager.request(logoutUser)}>
                            <span className="danger">Выйти</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
