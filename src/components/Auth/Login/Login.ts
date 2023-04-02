/** @module Components */

import { Component } from "components/Component";
import { validateForm } from "components/Auth/FormValidation";
import { ajax } from "modules/ajax";
import { ResponseUserLight } from "responses/ResponsesUser";
import { EscapeModalFunc, RedirectTo, SetUserDataFunc } from "../AuthModalProps";
import LoginTemplate from "templates/Auth/Login/Login.handlebars";

import { store } from 'flux/index'

/**
 * Login component
 * @class
 * @extends Component
 */
export class Login extends Component {
    #setUserData: SetUserDataFunc;

    constructor(
        parent: Component,
        setUserData: SetUserDataFunc,
    ) {
        super(parent);

        this.#setUserData = setUserData;

        this.registerEvent(() => document.getElementById("login-form"), "submit", this.#formSubmit);
        this.registerEvent(() => document.getElementById("redirect-register-link"), "click", ()=>store.dispatch.bind(store)({type:"openRegister"}));
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
                            // this.#setUserData({ userData: json.body.user, needRerender: false });

                            store.dispatch({type: 'setData', payload: json.body.user});
                            store.dispatch({type: "close"});
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
