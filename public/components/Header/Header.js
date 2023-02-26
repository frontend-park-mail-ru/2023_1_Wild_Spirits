import { Component } from "/components/Component.js";
import HeaderTemplate from "/compiled/Header/Header.handlebars.js";

export class Header extends Component {
    constructor(parent) {
        super(parent);
    }

    btnClick = () => {
        console.log("OC click");
        this.rerender();
    };

    removeEvents() {
        const btn = document.getElementById(this.id);
        btn.removeEventListener("click", this.btnClick);
    }

    addEvents() {
        const btn = document.getElementById(this.id);
        btn.addEventListener("click", this.btnClick);
    }

    render() {
        return HeaderTemplate();
    }
}
