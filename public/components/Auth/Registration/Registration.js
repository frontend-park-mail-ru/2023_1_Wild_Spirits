import { Component } from "/components/Component.js";
import RegistrationTemplate from "/compiled/Auth/Registration/Registration.handlebars.js";

export class Registration extends Component {
    constructor(parent) {
        super(parent)
    }

    #formSubmit(event) {
        event.preventDefault();
                
        const formData = new FormData(event.target);

        for (const entry of formData.entries()) {
            console.log(entry)
        }
    }

    removeEvents() {
        const form = document.getElementById("register-form");

        if (form) {
            form.removeEventListener('submit', this.#formSubmit);
        }
    }

    addEvents() {
        const form = document.getElementById("register-form");

        if (form) {
            form.addEventListener('submit', this.#formSubmit);
        }
    }

    render() {
        return RegistrationTemplate();
    }
};
