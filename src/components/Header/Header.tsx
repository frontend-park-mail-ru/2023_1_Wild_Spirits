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
import { openCitySelector } from "flux/slices/modalWindowSlice";

import { logoutUser } from "requests/user";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { requestManager } from "requests/index";
import { Link } from "components/Common/Link";

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

    render() {
        const getProfileLink = () => {
            const userData = store.getState().user.data;

            if (userData !== undefined) {
                return (
                    <div className="profile-link">
                        <Link
                            id="profile-link"
                            className="profile-link__profile-block"
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
                        </Link>
                        <div id="profile-link-logout">
                            <img className="profile-link__logout-img" src="/assets/img/logout.png"
                                onClick={this.#onLogout}/>
                        </div>
                    </div>
                );
            }

            return [
                <a className="link" onClick={() => store.dispatch.bind(store)(openLogin())}>
                    Вход
                </a>,
                "/",
                <a className="link" onClick={() => store.dispatch.bind(store)(openRegister())}>
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
            }
            return res;
        };

        const cities = getCitiesNames(store.getState().header).map((cityName) => <option>{cityName}</option>);
        const categories = createCategories(store.getState().header.categories);

        const selectedCityName = getSelectedCityName(store.getState().header);

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
                            onChange={e => this.#search(e as unknown as Event)}
                            placeholder="Поиск"
                            value={store.getState().header.searchQuery}
                            className="search"
                        />
                    </div>

                    <div className="header__city-selector">
                        <button className="header__city-selector__button"
                            onClick={()=>store.dispatch(openCitySelector())}>
                            <img src="/assets/img/position_icon.png"></img>
                            <span>
                                {selectedCityName}
                            </span>
                        </button>
                        {/* <select onChange={(e) => this.#selectCity(e as unknown as Event)}>{cities}</select> */}
                    </div>

                    <div className="profile-link">{getProfileLink()}</div>
                </div>

                <div className="header__bottom__line">{categories}</div>
            </div>
        );
    }
}
