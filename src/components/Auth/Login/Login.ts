/** @module Components */

import { Component } from "components/Component";
import { validateForm, warningMsg } from "components/Auth/FormValidation";
import LoginTemplate from "templates/Auth/Login/Login.handlebars";

import { store } from "flux";
import { openRegister } from "flux/slices/modalWindowSlice";

import { loginUser } from "requests/user";

/**
 * Login component
 * @class
 * @extends Component
 */
export class Login extends Component {
    constructor(parent: Component) {
        super(parent);

        this.registerEvent(() => document.getElementById("login-form"), "submit", this.#formSubmit);
        this.registerEvent(
            () => document.getElementById("redirect-register-link"),
            "click",
            () => store.dispatch.bind(store)(openRegister())
        );
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
                console.log('login')
                loginUser(formData, warningMsg);
            }
        }
    };

    render() {
        return LoginTemplate();
    }
}
