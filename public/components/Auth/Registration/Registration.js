/** @module Components */

import { Component } from "/components/Component.js";
import FormValidation from "/components/Auth/FormValidation.js";
import RegistrationTemplate from "/compiled/Auth/Registration/Registration.handlebars.js";

/**
 * Registration component
 * @class
 * @extends Component
 */
export class Registration extends FormValidation(Component) {
    constructor(parent) {
        super(parent)

        this.registerEvent(()=>document.getElementById('register-form'), 'submit', this.#formSubmit);
    }

    /**
     * form submit event handler
     * @param {Event} event 
     */
    #formSubmit = (event) => {
        event.preventDefault();

        this.validate(event.target);
    }

    render() {
        return RegistrationTemplate();
    }
}
