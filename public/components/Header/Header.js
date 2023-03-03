import { Component } from "/components/Component.js";
import HeaderTemplate from "/compiled/Header/Header.handlebars.js";

export class Header extends Component {
    #selectedCategoryId;
    #selectedCity;

    #onLogin;

    #cities;

    constructor(parent, onLogin) {
        super(parent);

        this.#onLogin = onLogin;

        this.#selectedCategoryId         // const modal = document.getElementsByClassName('modal')[0];

        // modal.removeEventListener('click', this.closeModal);= null;

        this.#cities = ["Москва", "Санкт-Петербург", "Нижний Новгород"];
        this.#selectedCity = this.#cities[0];
    }

    linkClick = (event) => {
        const id = event.target.id.split("-").at(-1);
        this.#selectedCategoryId = id;
        this.rerender();
    };

    removeEvents() {
        const links = document.getElementsByClassName("header__category");

        for (let i = 0; i < links.length; i++) {
            links[i].removeEventListener("click", this.linkClick);
        }

        // const loginLink = header.getElementById('login-link');
        // loginLink.removeEventListener('click', this.#onLogin);
    }

    addEvents() {
        const header = document.getElementsByClassName('header')[0];
        const links = header.getElementsByClassName('header__category');

        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener('click', this.linkClick);
        }

        const select = header.getElementsByTagName('select')[0];

        select.value = this.#selectedCity;

        select.addEventListener('change', (e)=>{
            this.#selectedCity = select.value;
        });

        const loginLink = document.getElementById('login-link');
        loginLink.addEventListener('click', this.#onLogin);
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
