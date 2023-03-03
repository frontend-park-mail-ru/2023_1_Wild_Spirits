import { Component } from "/components/Component.js";
import HeaderTemplate from "/compiled/Header/Header.handlebars.js";

export class Header extends Component {
    #selectedCategoryId;
    #selectedCity;

    #onLogin;
    #onSignup

    #cities;

    constructor(parent, onLogin, onSignup) {
        super(parent);

        this.#onLogin = onLogin;
        this.#onSignup = onSignup;

        this.#selectedCategoryId

        this.#cities = ["Москва", "Санкт-Петербург", "Нижний Новгород"];
        this.#selectedCity = this.#cities[0];
    }

    #linkClick = (event) => {
        const id = event.target.id.split("-").at(-1);
        this.#selectedCategoryId = id;
        this.rerender();
    };

    #selectCity = (e) => {
        this.#selectedCity = e.target.value;
    }

    removeEvents() {
        const header = document.getElementsByClassName('header')[0];
        const links = header.getElementsByClassName('header__category');

        for (let i = 0; i < links.length; i++) {
            links[i].removeEventListener("click", this.#linkClick);
        }

        const select = header.getElementsByTagName('select')[0];

        select.removeEventListener('change', this.#selectCity);

        const loginLink = document.getElementById('login-link');
        loginLink.removeEventListener('click', this.#onLogin);

        const signupLink = document.getElementById('signup-link');
        signupLink.removeEventListener('click', this.#onSignup);
    }

    addEvents() {
        const header = document.getElementsByClassName('header')[0];
        const links = header.getElementsByClassName('header__category');

        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener('click', this.#linkClick);
        }

        const select = header.getElementsByTagName('select')[0];

        select.value = this.#selectedCity;

        select.addEventListener('change', this.#selectCity);

        const loginLink = document.getElementById('login-link');
        loginLink.addEventListener('click', this.#onLogin);

        const signupLink = document.getElementById('signup-link');
        signupLink.addEventListener('click', this.#onSignup);
    }

    render() {
        const categories = ["Концерты", "Театр", "Кино", "Фестивали", "Выставки"];

        return HeaderTemplate({
            id: this.id,
            categories: categories,
            selectedCategoryId: this.#selectedCategoryId,
            cities: this.#cities,
        });
    }
}
