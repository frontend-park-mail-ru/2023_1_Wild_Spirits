/** @module Components */

import { Component } from "/components/Component.js";
import FormValidation from "/components/Auth/FormValidation.js";
import RegistrationTemplate from "/compiled/Auth/Registration/Registration.handlebars.js";

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

        this.registerEvent(() => document.querySelector('input[type=checkbox][name=accept]'), "change", this.#toggleForm)
    }

    /**
     * toggles form submit button
     */
    #toggleForm = () => {
        const submitButton = document.getElementById("register-submit-button");
        submitButton.disabled = !submitButton.disabled;
    }

    validate(form) {
        if (!super.validate(form)) {
            return false;
        }

        const formData = new FormData(form);

        if (formData.get("password") !== formData.get("passwordConfirmation")) {
            const warningEl = form.querySelector("input[name=passwordConfirmation] + .warning");
            warningEl.textContent = "пароли не совпадают";
        }

        return true;
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
                    } else {
                        this.warningMsg(json.errorMsg);
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
