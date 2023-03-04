import { Component } from "/components/Component.js";
import { Header } from "/components/Header/Header.js";
import AppTemplate from "/compiled/App.handlebars.js";
import { EventList } from "/components/Events/EventList/EventList.js";
import { ModalWindow } from "/components/ModalWindow/ModalWindow.js";
import { Login } from "/components/Auth/Login/Login.js";
import { Registration } from "/components/Auth/Registration/Registration.js";
import { INDEX, LOGIN, REGISTER } from "./Auth/FormModalState.js";

export class App extends Component {
    #headerComponent;
    #contentComponent;
    #modalWindowComponent;

    #loginComponent;
    #registerComponent;

    #state;

    #userData = undefined;

    constructor(parent) {
        super(parent);
        window.ajax
            .get({
                url: "/authorized",
                credentials: true,
            })
            .then(({ json, response }) => {
                if (response.ok) {
                    console.log(response.status, json);
                    this.setUserData(json.body.user);
                }
            })
            .catch((err) => {
                console.log("catch:", err);
            });

        this.#headerComponent = this.createComponent(
            Header,
            () => this.changeState(LOGIN),
            () => this.changeState(REGISTER),
            () => this.#userData
        );
        this.#contentComponent = this.createComponent(EventList);
        this.#modalWindowComponent = this.createComponent(ModalWindow, this.escapeModal);

        this.#loginComponent = this.createComponent(Login, this.setUserData, this.escapeModal);
        this.#registerComponent = this.createComponent(Registration, this.setUserData, this.escapeModal);

        this.#state = INDEX;
    }

    escapeModal = () => {
        this.changeState(INDEX);
    };

    changeState(state) {
        this.#state = state;
        this.rerender();
    }

    setUserData = (userData, needRerender = true) => {
        this.#userData = userData;
        if (needRerender) {
            this.rerender();
        }
    };

    rerender() {
        this.removeChildEvents();
        this.parent.innerHTML = this.render();
        this.addChildEvents();
    }

    render() {
        let modalWindow = "";

        if (this.#state == "login") {
            modalWindow = this.#modalWindowComponent.render(this.#loginComponent.render());
        } else if (this.#state == "register") {
            modalWindow = this.#modalWindowComponent.render(this.#registerComponent.render());
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
