/** @module Components */

import { Component } from "components/Component";
import FormValidation from "components/Auth/FormValidation";
import RegistrationTemplate from "templates/Auth/Registration/Registration.handlebars";

/**
 * Registration component
 * @class
 * @extends Component
 */
export class Registration extends FormValidation(Component) {
    #setUserData;
    #escapeModal;

    constructor(parent, setUserData, escapeModal, redirectToLogin) {
        super(parent);

        this.#setUserData = setUserData;
        this.#escapeModal = escapeModal;

        this.registerEvent(() => document.getElementById("register-form"), "submit", this.#formSubmit);
        this.registerEvent(() => document.getElementById("redirect-login-link"), "click", redirectToLogin);
    }

    /**
     * form submit event handler
     * @param {Event} event
     */
    #formSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        console.log(formData.get("password"));

        if (this.validate(event.target)) {
            window.ajax
                .post({
                    url: "/register",
                    credentials: true,
                    body: {
                        email: formData.get("email"),
                        pass: formData.get("password"),
                        username: formData.get("nickname"),
                    },
                })
                .then(({ json, response }) => {
                    if (response.ok) {
                        const csrf = response.headers.get("x-csrf-token");
                        if (response.headers.get("x-csrf-token")) {
                            window.ajax.addHeaders({ "x-csrf-token": csrf });
                        }
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
        return RegistrationTemplate();
    }
}
