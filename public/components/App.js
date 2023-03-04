/** @module Components */

import { Component } from "/components/Component.js";
import { Header } from "/components/Header/Header.js";
import AppTemplate from "/compiled/App.handlebars.js";
import { EventList } from "/components/Events/EventList/EventList.js";
import { ModalWindow } from "/components/ModalWindow/ModalWindow.js";
import { Login } from "/components/Auth/Login/Login.js"
import { Registration } from "/components/Auth/Registration/Registration.js";

/**
 * @classdesc Main app component
 * @class
 * @extends Component
 */
export class App extends Component {
    #headerComponent;
    #contentComponent;
    #modalWindowComponent;

    #loginComponent;
    #registerComponent;

    #state;
    constructor(parent) {
        super(parent);
        this.#headerComponent = this.createComponent(Header, () => {
            this.changeState("login");
        }, () => {
            this.changeState("register");
        });
        this.#contentComponent = this.createComponent(EventList);
        this.#modalWindowComponent = this.createComponent(ModalWindow, () => {
            this.changeState("index");
        });

        this.#loginComponent = this.createComponent(Login);
        this.#registerComponent = this.createComponent(Registration);

        this.#state = "index";
    }

    /**
     * callback for changing app state
     * @param {string} state 
     */
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
        let modalWindowContent = "";
        let modalWindow = "";

        if (this.#state == "login") {
            modalWindowContent = this.#loginComponent.render();
            modalWindow = this.#modalWindowComponent.render(modalWindowContent);
        } else if (this.#state == "register") {
            modalWindowContent = this.#registerComponent.render();
            modalWindow = this.#modalWindowComponent.render(modalWindowContent);
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
