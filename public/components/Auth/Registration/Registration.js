import { Component } from "/components/Component.js";
import RegistrationTemplate from "/compiled/Auth/Registration/Registration.handlebars.js";

export class Registration extends Component {
    constructor(parent) {
        super(parent)

        this.registerEvent(()=>document.getElementById('register-form'), 'submit', this.#formSubmit);
    }

    #formSubmit(event) {
        event.preventDefault();
                
        const formData = new FormData(event.target);

        for (const entry of formData.entries()) {
            console.log(entry)
        }
    }

    render() {
        return RegistrationTemplate();
    }
};
