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

    constructor(parent, setUserData, escapeModal) {
        super(parent);

        this.#setUserData = setUserData;
        this.#escapeModal = escapeModal;

        this.registerEvent(() => document.getElementById("register-form"), "submit", this.#formSubmit);
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

    // #formSubmit(event) {
    //     event.preventDefault();

    //     const formData = new FormData(event.target);

    //     for (const entry of formData.entries()) {
    //         console.log(entry)
    //     }
    // }

    render() {
        return RegistrationTemplate();
    }
}
