import { Component } from '/components/Component.js';
import LoginTemplate from '/compiled/Auth/Login/Login.handlebars.js';

export class Login extends Component {
    constructor(parent) {
        super(parent)

        this.registerEvent(()=>document.getElementById('login-form'), 'submit', this.#formSubmit);
    }

    #formSubmit(event) {
        event.preventDefault();
                
        const formData = new FormData(event.target);

        for (const entry of formData.entries()) {
            console.log(entry)
        }
    }

    render() {
        return LoginTemplate();
    }
};
