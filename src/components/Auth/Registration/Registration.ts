/** @module Components */

import { Component } from "components/Component";
import { validateForm, warningMsg } from "components/Auth/FormValidation";
import { ajax } from "modules/ajax";
import { ResponseUserLight } from "responses/ResponsesUser";
import RegistrationTemplate from "templates/Auth/Registration/Registration.handlebars";

import { store } from "flux";
import { close, openLogin } from "flux/slices/modalWindowSlice";
import { setData } from "flux/slices/userSlice";

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
            ajax.post<ResponseUserLight>({
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
                        if (csrf) {
                            ajax.addHeaders({ "x-csrf-token": csrf });
                        }
                        store.dispatch(setData(json.body!.user));
                        store.dispatch(close());
                    } else {
                        warningMsg(json.errorMsg);
                    }
                })
                .catch((error) => {
                    console.log("catch:", error);
                });
        }
    };

    render() {
        return RegistrationTemplate();
    }
}
