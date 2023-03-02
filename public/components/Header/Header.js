import { Component } from "/components/Component.js";
import HeaderTemplate from "/compiled/Header/Header.handlebars.js";
import { putSVGInline } from "/modules/svg.js";

export class Header extends Component {
    #selectedId;
    constructor(parent) {
        super(parent);

        this.selectedId = null;
    }

    linkClick = (event) => {
        console.log(this);
        const id = event.target.id.split("-").at(-1);
        this.#selectedId = id;
        this.rerender();
    };

    removeEvents() {
        const links = document.getElementsByClassName("header__category");

        for (let i = 0; i < links.length; i++) {
            links[i].removeEventListener("click", this.linkClick);
        }
    }

    addEvents() {
        const links = document.getElementsByClassName("header__category");

        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener("click", this.linkClick);
        }
        putSVGInline("logo-full", `svg-container-${this.id}`);
    }

    render() {
        const categories = ["Концерты", "Театр", "Кино", "Фестивали", "Выставки"];

        return HeaderTemplate({ id: this.id, categories: categories, selectedId: this.#selectedId });
    }
}
