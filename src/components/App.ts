/** @module Components */

import { Component } from "components/Component";
import { Header } from "components/Header/Header";
import { EventList } from "components/Events/EventList/EventList";
import { ModalWindow } from "components/ModalWindow/ModalWindow";
import { Login } from "components/Auth/Login/Login";
import { Registration } from "components/Auth/Registration/Registration";

import { Calendar } from "./Calendar/Calendar";
import { Tags } from "./Tags/Tags";

import { ajax } from "modules/ajax";
import { ResponseUserLight } from "responses/ResponsesUser";
import AppTemplate from "templates/App.handlebars";
import { router } from "modules/router";
import { Profile } from "./Auth/Profile/Profile";
import { svgInliner } from "modules/svgLoader";

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
    #eventListComponent: EventList;
    #modalWindowComponent: ModalWindow;
    #calendarComponent: Calendar;
    #tagsComponent: Tags;
    #loginComponent: Login;
    #registerComponent: Registration;
    #profileComponent: Profile;

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
                    store.dispatch(setData(json.body.user));
                }
            })
            .catch((error) => {
                console.log("catch:", error);
            });

        this.#headerComponent = this.createComponent(Header);
        this.#eventListComponent = this.createComponent<EventList>(EventList);
        this.#modalWindowComponent = this.createComponent(ModalWindow);

        this.#loginComponent = this.createComponent(Login);
        this.#registerComponent = this.createComponent(Registration);

        this.#calendarComponent = this.createComponent(Calendar);
        this.#tagsComponent = this.createComponent(Tags);

        this.#profileComponent = this.createComponent(Profile);
    }

    rerender() {
        this.removeChildEvents();
        if (this.parent instanceof HTMLElement) {
            this.parent.innerHTML = this.render();
        }
        this.addChildEvents();
        svgInliner.applyRules();
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

        const template = AppTemplate({
            header: this.#headerComponent.render(),
            content: router.switch({ "/": () => this.#eventListComponent, "/profile": () => this.#profileComponent }),
            footer: "Footer",
            modalWindow: modalWindow,
            sidebar: this.#calendarComponent.render() + this.#tagsComponent.render()
        });
        return template;
    }
}
