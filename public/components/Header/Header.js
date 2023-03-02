import { Component } from "/components/Component.js";
import HeaderTemplate from "/compiled/Header/Header.handlebars.js";

export class Header extends Component {
    #selectedCategoryId;
    #selectedCity;

    #cities;

    constructor(parent) {
        super(parent);

        this.#selectedCategoryId = null;

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
