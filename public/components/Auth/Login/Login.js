/** @module Components */

import { Component } from '/components/Component.js';
import FormValidation from '/components/Auth/FormValidation.js';
import LoginTemplate from '/compiled/Auth/Login/Login.handlebars.js';

/**
 * Login component
 * @class
 * @extends Component
 */
export class Login extends FormValidation(Component) {
    constructor(parent) {
        super(parent)

        this.registerEvent(()=>document.getElementById('login-form'), 'submit', this.#formSubmit);
    }

    /**
     * Form submit event handler
     * @param {Event} event 
     */
    #formSubmit = (event) => {
        event.preventDefault();

        this.validate(event.target);
    }

    render() {
        return LoginTemplate();
    }
}
