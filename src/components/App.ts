/** @module Components */

import { Component, ComponentParentType } from "components/Component";
import { Header } from "components/Header/Header";
import { EventList } from "components/Events/EventList/EventList";
import { ModalWindow } from "components/ModalWindow/ModalWindow";
import { Login } from "components/Auth/Login/Login";
import { Registration } from "components/Auth/Registration/Registration";
import { Calendar } from "components/Calendar/Calendar";
import { FormModalState } from "./Auth/FormModalState";
import { ajax } from "modules/ajax";
import { ResponseUserLight } from "responses/ResponsesUser";
import { TUserAvailable } from "models/User";
import { SetUserDataProps } from "./Auth/AuthModalProps";
import AppTemplate from "templates/App.handlebars";

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

    #calendarComponent;

    #state;

    #userData: TUserAvailable = undefined;

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
                    this.setUserData({ userData: json.body.user });
                }
            })
            .catch((error) => {
                console.log("catch:", error);
            });

        this.#headerComponent = this.createComponent(
            Header,
            () => this.changeState(FormModalState.LOGIN),
            () => this.changeState(FormModalState.REGISTER),
            () => this.#userData,
            this.setUserData
        );
        this.#contentComponent = this.createComponent<EventList>(EventList);
        this.#modalWindowComponent = this.createComponent(ModalWindow, this.escapeModal);

        this.#loginComponent = this.createComponent(Login, this.setUserData, this.escapeModal, () =>
            this.changeState(FormModalState.REGISTER)
        );
        this.#registerComponent = this.createComponent(Registration, this.setUserData, this.escapeModal, () =>
            this.changeState(FormModalState.LOGIN)
        );

        this.#calendarComponent = this.createComponent(Calendar);

        this.#state = FormModalState.INDEX;
    }

    escapeModal = () => {
        this.changeState(FormModalState.INDEX);
    };

    /**
     * callback for changing app state
     * @param {string} state
     */
    changeState(state: FormModalState.StateType) {
        this.#state = state;
        this.rerender();
    }

    setUserData = ({ userData, needRerender = true }: SetUserDataProps) => {
        this.#userData = userData;
        if (needRerender) {
            this.rerender();
        }
    };

    rerender() {
        this.removeChildEvents();
        if (this.parent instanceof HTMLElement) {
            this.parent.innerHTML = this.render();
        }
        this.addChildEvents();
    }

    render() {
        let modalWindow = "";

        if (this.#state == FormModalState.LOGIN) {
            this.#modalWindowComponent.content = this.#loginComponent.render();
            modalWindow = this.#modalWindowComponent.render();
        } else if (this.#state == FormModalState.REGISTER) {
            this.#modalWindowComponent.content = this.#registerComponent.render();
            modalWindow = this.#modalWindowComponent.render();
        }

        const template = AppTemplate({
            header: this.#headerComponent.render(),
            content: this.#contentComponent.render(),
            footer: "Footer",
            modalWindow: modalWindow,
            calendar: this.#calendarComponent.render(),
        });
        return template;
    }
}
