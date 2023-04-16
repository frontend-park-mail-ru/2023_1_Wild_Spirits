/** @module Components */

import { Component } from "components/Component";
import { validateForm, warningMsg } from "components/Auth/FormValidation";
import RegistrationTemplate from "templates/Auth/Registration/Registration.handlebars";

import { store } from "flux";
import { openLogin } from "flux/slices/modalWindowSlice";

import { registerUser } from "requests/user";
import { requestManager } from "requests";

/**
 * Registration component
 * @class
 * @extends Component
 */
export class Registration extends Component {
    constructor(parent: Component) {
        super(parent);

        this.registerEvent(() => document.getElementById("register-form"), "submit", this.#formSubmit);
        this.registerEvent(
            () => document.getElementById("redirect-login-link"),
            "click",
            () => store.dispatch.bind(store)(openLogin())
        );
        this.registerEvent(() => document.querySelector('input[type=checkbox][name=accept]') as HTMLElement, "change", this.#toggleForm);
    }

    #toggleForm = () => {
        const submitButton = document.getElementById("register-submit-button") as HTMLButtonElement;
        if (submitButton)
            submitButton.disabled = !submitButton.disabled;
    }

    /**
     * form submit event handler
     * @param {Event} event
     */
    #formSubmit = (event: SubmitEvent) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);

        if (validateForm(event.target as HTMLFormElement)) {
            requestManager.request(registerUser, formData, warningMsg);
        }
    };

    render() {
        return RegistrationTemplate();
    }
}
