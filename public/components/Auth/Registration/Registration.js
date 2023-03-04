import { Component } from "/components/Component.js";
import FormValidation from "/components/Auth/FormValidation.js";
import RegistrationTemplate from "/compiled/Auth/Registration/Registration.handlebars.js";

export class Registration extends FormValidation(Component) {
    constructor(parent) {
        super(parent);

        this.registerEvent(() => document.getElementById("register-form"), "submit", this.#formSubmit);
    }

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
