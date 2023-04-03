/** @module Components */

import { Component, ComponentParentType } from "components/Component";
import { Header } from "components/Header/Header";
import { EventList } from "components/Events/EventList/EventList";
import { ModalWindow } from "components/ModalWindow/ModalWindow";
import { Login } from "components/Auth/Login/Login";
import { Registration } from "components/Auth/Registration/Registration";
import { Calendar } from "components/Calendar/Calendar";
import { ajax } from "modules/ajax";
import { ResponseUserLight } from "responses/ResponsesUser";
import { TUserAvailable } from "models/User";
import { SetUserDataProps } from "./Auth/AuthModalProps";
import AppTemplate from "templates/App.handlebars";
import { router } from "modules/router";
import { Profile } from "./Auth/Profile/Profile";

import { store } from "flux";
import { ModalWindowName } from "flux/slices/modalWindowSlice";
import { setData } from "flux/slices/userSlice";

/**
 * @classdesc Main app component
 * @class
 * @extends Component
 */
export class App extends Component {
    #headerComponent: Header;
    #contentComponent;
    #modalWindowComponent;

    #loginComponent;
    #registerComponent;
    #profileComponent;

    #calendarComponent;

    constructor(parent: HTMLElement) {
        super(parent);
        ajax.get<ResponseUserLight>({
            url: "/authorized",
            credentials: true,
        })
            .then(({ json, response }) => {
                if (response.ok) {
                    const csrf = response.headers.get("x-csrf-token");
                    if (csrf) {
                        ajax.addHeaders({ "x-csrf-token": csrf });
                    }
                    // this.setUserData({ userData: json.body.user });
                    store.dispatch(setData(json.body.user));
                }
            })
            .catch((error) => {
                console.log("catch:", error);
            });

        this.#headerComponent = this.createComponent(Header);
        this.#contentComponent = this.createComponent<EventList>(EventList);
        this.#modalWindowComponent = this.createComponent(ModalWindow);

        this.#loginComponent = this.createComponent(Login);
        this.#registerComponent = this.createComponent(Registration);

        this.#profileComponent = this.createComponent(Profile);

        this.#calendarComponent = this.createComponent(Calendar);
    }

    rerender() {
        this.removeChildEvents();
        if (this.parent instanceof HTMLElement) {
            this.parent.innerHTML = this.render();
        }
        this.addChildEvents();
    }

    render() {
        let modalWindow = "";
        router.reset();
        if (store.getState().modalWindow.name !== ModalWindowName.NONE) {
            switch (store.getState().modalWindow.name) {
                case ModalWindowName.LOGIN:
                    this.#modalWindowComponent.content = this.#loginComponent.render();
                    break;
                case ModalWindowName.REGISTER:
                    this.#modalWindowComponent.content = this.#registerComponent.render();
                    break;
            }
            modalWindow = this.#modalWindowComponent.render();
        }

        // if (this.#state == FormModalState.LOGIN) {
        //     this.#modalWindowComponent.content = this.#loginComponent.render();
        //     modalWindow = this.#modalWindowComponent.render();
        // } else if (this.#state == FormModalState.REGISTER) {
        //     this.#modalWindowComponent.content = this.#registerComponent.render();
        //     modalWindow = this.#modalWindowComponent.render();
        // }

        const template = AppTemplate({
            header: this.#headerComponent.render(),
            content: router.switch({ "/": () => this.#contentComponent, "/profile": () => this.#profileComponent }),
            footer: "Footer",
            modalWindow: modalWindow,
            calendar: this.#calendarComponent.render(),
        });
        return template;
    }
}
