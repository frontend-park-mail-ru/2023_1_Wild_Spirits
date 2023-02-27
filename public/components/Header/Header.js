import { Component } from "/components/Component.js";
import HeaderTemplate from "/compiled/Header/Header.handlebars.js";
import { putSVGInline } from "/modules/svg.js";

export class Header extends Component {
    #selectedId;
    constructor(parent) {
        super(parent);

        this.selectedId = null;
    }

    removeEvents() {
    }

    addEvents() {
        const links = document.getElementsByClassName('header__category');

        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener('click',  ()=>{
                this.#selectedId = i;
                this.rerender();
            });
        }
        putSVGInline('logo-full', `svg-container-${this.id}`);
    }

    render() {
        const categories = ["Концерты", "Театр", "Кино", "Фестивали", "Выставки"]

        return HeaderTemplate({id: this.id, categories: categories, selectedId: this.#selectedId});
    }
}
