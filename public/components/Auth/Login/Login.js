import { Component } from '/components/Component.js';
import FormValidation from '/components/Auth/FormValidation.js';
import LoginTemplate from '/compiled/Auth/Login/Login.handlebars.js';

export class Login extends FormValidation(Component) {
    constructor(parent) {
        super(parent)

        this.registerEvent(()=>document.getElementById('login-form'), 'submit', this.formSubmit);
    }

    render() {
        return LoginTemplate();
    }
};
