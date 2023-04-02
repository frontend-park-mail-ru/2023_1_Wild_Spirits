/** @module Components */

import { Component } from "components/Component";
import { validateForm } from "components/Auth/FormValidation";
import { ajax } from "modules/ajax";
import { ResponseUserLight } from "responses/ResponsesUser";
import { EscapeModalFunc, RedirectTo, SetUserDataFunc } from "../AuthModalProps";
import RegistrationTemplate from "templates/Auth/Registration/Registration.handlebars";

import { store } from "flux/index";

/**
 * Registration component
 * @class
 * @extends Component
 */
export class Registration extends Component {
    #setUserData;

    constructor(
        parent: Component,
        setUserData: SetUserDataFunc,
        escapeModal: EscapeModalFunc
    ) {
        super(parent);

        this.#setUserData = setUserData;

        this.registerEvent(() => document.getElementById("register-form"), "submit", this.#formSubmit);
        this.registerEvent(() => document.getElementById("redirect-login-link"), "click", ()=>store.dispatch.bind(store)({type:"openLogin"}));
    }

    /**
     * form submit event handler
     * @param {Event} event
     */
    #formSubmit = (event: SubmitEvent) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        console.log(formData.get("password"));

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
                        this.#setUserData({ userData: json.body.user, needRerender: false });
                        store.dispatch({type: "close"});
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
