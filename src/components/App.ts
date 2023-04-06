/** @module Components */

import { Component } from "components/Component";
import { Header } from "components/Header/Header";
import { EventList } from "components/Events/EventList/EventList";
import { ModalWindow } from "components/ModalWindow/ModalWindow";
import { Login } from "components/Auth/Login/Login";
import { Registration } from "components/Auth/Registration/Registration";
import { Calendar } from "components/Calendar/Calendar";
import { Tags } from "./Tags/Tags";
import { ajax } from "modules/ajax";
import { ResponseUserLight } from "responses/ResponsesUser";
import AppTemplate from "templates/App.handlebars";
import { addRouterEvents, removeRouterEvents, router } from "modules/router";
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
    #contentComponent;
    #modalWindowComponent;

    #loginComponent;
    #registerComponent;
    #profileComponent;

    #calendarComponent;
    #tagsComponent: Tags;

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
        this.#contentComponent = this.createComponent<EventList>(EventList);
        this.#modalWindowComponent = this.createComponent(ModalWindow);

        this.#loginComponent = this.createComponent(Login);
        this.#registerComponent = this.createComponent(Registration);

        this.#profileComponent = this.createComponent(Profile);

        this.#calendarComponent = this.createComponent(Calendar);
        this.#tagsComponent = this.createComponent(Tags);
    }

    rerender() {
        removeRouterEvents();
        this.removeChildEvents();
        if (this.parent instanceof HTMLElement) {
            this.parent.innerHTML = this.render();
        }
        this.addChildEvents();
        svgInliner.applyRules();
        addRouterEvents();
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
            content: router.switchComponent({
                "/": () => this.#contentComponent,
                "/profile": () => this.#profileComponent,
            }),
            footer: "Footer",
            modalWindow: modalWindow,
            calendar: this.#calendarComponent.render(),
            tags: this.#tagsComponent.render(),
        });
        return template;
    }
}
