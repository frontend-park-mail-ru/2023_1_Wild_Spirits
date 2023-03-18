/** @module Components */

import { Component } from "components/Component";
import { validateForm } from "components/Auth/FormValidation";
import { ajax } from "modules/ajax";
import { ResponseUserLight } from "responses/ResponsesUser";
import { EscapeModalFunc, RedirectTo, SetUserDataFunc } from "../AuthModalProps";
import LoginTemplate from "templates/Auth/Login/Login.handlebars";

/**
 * Login component
 * @class
 * @extends Component
 */
export class Login extends Component {
    #setUserData: SetUserDataFunc;
    #escapeModal: EscapeModalFunc;

    constructor(
        parent: Component,
        setUserData: SetUserDataFunc,
        escapeModal: EscapeModalFunc,
        redirectToRegister: RedirectTo
    ) {
        super(parent);

        this.#setUserData = setUserData;
        this.#escapeModal = escapeModal;

        this.registerEvent(() => document.getElementById("login-form"), "submit", this.#formSubmit);
        this.registerEvent(() => document.getElementById("redirect-register-link"), "click", redirectToRegister);
    }

    /**
     * Form submit event handler
     * @param {Event} event
     */
    #formSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        if (event.target) {
            if (validateForm(event.target as HTMLFormElement)) {
                ajax.post<ResponseUserLight>({
                    url: "/login",
                    credentials: true,
                    body: { email: formData.get("email"), pass: formData.get("password") },
                })
                    .then(({ json, response }) => {
                        if (response.ok) {
                            const csrf = response.headers.get("x-csrf-token");
                            if (csrf) {
                                ajax.addHeaders({ "x-csrf-token": csrf });
                            }
                            this.#setUserData({ userData: json.body.user, needRerender: false });
                            this.#escapeModal();
                        }
                    })
                    .catch((error) => {
                        console.log("catch:", error);
                    });
            }
        }
    };

    render() {
        return LoginTemplate();
    }
}
