import { Component } from "/components/Component.js";
import HeaderTemplate from "/compiled/Header/Header.handlebars.js";
import { putSVGInline } from "/modules/svg.js";

export class Header extends Component {
    constructor(parent) {
        super(parent);
    }

    btnClick = () => {
        console.log("OC click");
        this.rerender();
    };

    removeEvents() {
        // const btn = document.getElementById(this.id);
        // btn.removeEventListener("click", this.btnClick);
    }

    addEvents() {
        // const btn = document.getElementById(this.id);
        // btn.addEventListener("click", this.btnClick);
    }

    render() {
        // const logo = getSVGInline();


        putSVGInline('logo-full', `svg-container-${this.id}`);

        const categories = ["Концерты", "Театр", "Кино", "Фестивали", "Выставки"]

        return HeaderTemplate({id: this.id, categories: categories, selectedId: 2});
    }
}
