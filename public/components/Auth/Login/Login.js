import { Component } from "/components/Component.js";
import FormValidation from "/components/Auth/FormValidation.js";
import LoginTemplate from "/compiled/Auth/Login/Login.handlebars.js";

export class Login extends FormValidation(Component) {
    constructor(parent) {
        super(parent);

        this.registerEvent(() => document.getElementById("login-form"), "submit", this.#formSubmit);
    }

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
