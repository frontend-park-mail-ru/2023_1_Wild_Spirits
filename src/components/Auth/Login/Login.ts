/** @module Components */

import { Component } from "components/Component";
import { validateForm } from "components/Auth/FormValidation";
import { ajax } from "modules/ajax";
import { ResponseUserLight } from "responses/ResponsesUser";
import LoginTemplate from "templates/Auth/Login/Login.handlebars";

import { store } from "flux";
import { setData } from "flux/slices/userSlice";
import { close, openRegister } from "flux/slices/modalWindowSlice";

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
                        store.dispatch(setData(json.body.user), close());
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
