/** @module Components */

import { Component } from "/components/Component.js";
import FormValidation from "/components/Auth/FormValidation.js";
import LoginTemplate from "/compiled/Auth/Login/Login.handlebars.js";

/**
 * Login component
 * @class
 * @extends Component
 */
export class Login extends FormValidation(Component) {
    #setUserData;
    #escapeModal;

    constructor(parent, setUserData, escapeModal, redirectToRegister) {
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
    #formSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        if (this.validate(event.target)) {
            window.ajax
                .post({
                    url: "/login",
                    credentials: true,
                    body: { email: formData.get("email"), pass: formData.get("password") },
                })
                .then(({ json, response }) => {
                    if (response.ok) {
                        const csrf = response.headers.get("x-csrf-token");
                        if (response.headers.get("x-csrf-token")) {
                            window.ajax.addHeaders({ "x-csrf-token": csrf });
                        }
                        this.#setUserData(json.body.user, false);
                        this.#escapeModal();
                    } else {
                        this.warningMsg(json.errorMsg)
                    }
                })
                .catch((err) => {
                    console.log("catch:", err);
                });
        }
    };

    render() {
        return LoginTemplate();
    }
}
