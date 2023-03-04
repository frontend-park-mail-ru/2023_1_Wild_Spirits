/** @module Components */

import { Component } from '/components/Component.js';
import FormValidation from '/components/Auth/FormValidation.js';
import LoginTemplate from '/compiled/Auth/Login/Login.handlebars.js';

/**
 * Login component
 * @class
 * @extends Component
 */
export class Login extends FormValidation(Component) {
    #setUserData;
    #escapeModal;

    constructor(parent, setUserData, escapeModal) {
        super(parent);

        this.#setUserData = setUserData;
        this.#escapeModal = escapeModal;
        this.registerEvent(() => document.getElementById("login-form"), "submit", this.#formSubmit);
    }

    /**
     * Form submit event handler
     * @param {Event} event 
     */
    #formSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        console.log(formData.get("password"));

        if (this.validate(event.target)) {
            window.ajax
                .post({
                    url: "/login",
                    credentials: true,
                    body: { email: formData.get("email"), pass: formData.get("password") },
                })
                .then(({ json, response }) => {
                    if (response.ok) {
                        console.log(response.status, json);
                        this.#setUserData(json.body.user, false);
                        this.#escapeModal();
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
