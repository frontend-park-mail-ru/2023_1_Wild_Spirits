import { Component } from "/components/Component.js";
import { Header } from "./Header/Header.js";
import AppTemplate from "/compiled/App.handlebars.js";
import { EventList } from "./Events/EventList/EventList.js";
import { ModalWindow } from "/components/ModalWindow/ModalWindow.js";

export class App extends Component {
    #headerComponent;
    #contentComponent;
    #modalWindowComponent;

    #state;
    constructor(parent) {
        super(parent);
        this.#headerComponent = this.createComponent(Header, () => {
            this.changeState("login");
        });
        this.#contentComponent = this.createComponent(EventList);
        this.#modalWindowComponent = this.createComponent(ModalWindow, () => {
            this.changeState("index");
        });

        this.#state = "index";
    }

    changeState(state) {
        this.#state = state;
        this.rerender();
    }

    rerender() {
        this.removeChildEvents();
        this.parent.innerHTML = this.render();
        this.addChildEvents();
    }

    render() {
        let modalWindow = "";

        if (this.#state == "login") {
            modalWindow = this.#modalWindowComponent.render();
        }

        const template = AppTemplate({
            header: this.#headerComponent.render(),
            content: this.#contentComponent.render(),
            footer: "Footer",
            modalWindow: modalWindow,
        });
        return template;
    }
}
