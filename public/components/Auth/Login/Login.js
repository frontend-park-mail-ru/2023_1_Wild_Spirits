import { Component } from '/components/Component.js';
import LoginTemplate from '/compiled/Auth/Login/Login.handlebars.js';

export class Login extends Component {
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
        const form = document.getElementById("login-form");

        if (form) {
            form.removeEventListener('submit', this.#formSubmit);
        }
    }

    addEvents() {
        const form = document.getElementById("login-form");

        if (form) {
            form.addEventListener('submit', this.#formSubmit);
        }
    }

    render() {
        return LoginTemplate();
    }
};
