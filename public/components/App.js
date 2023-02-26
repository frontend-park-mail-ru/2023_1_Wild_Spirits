import { Component } from "/components/Component.js";
import { Header } from "./Header/Header.js";
import AppTemplate from "/compiled/App.handlebars.js";

export class App extends Component {
    #headerComponent;
    constructor(parent) {
        super(parent);
        this.#headerComponent = this.createComponent(Header);
    }

    rerender() {
        this.removeChildEvents();
        this.parent.innerHTML = this.render();
        this.addChildEvents();
    }

    render() {
        const template = AppTemplate({ header: this.#headerComponent.render(), content: "Content", footer: "Footer" });
        return template;
    }
}
