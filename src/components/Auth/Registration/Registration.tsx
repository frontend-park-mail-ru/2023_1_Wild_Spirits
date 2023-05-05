/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { validateForm, warningMsg } from "components/Auth/FormValidation";

import { store } from "flux";
import { openLogin } from "flux/slices/modalWindowSlice";

import { registerUser } from "requests/user";
import { requestManager } from "requests";

/**
 * Registration component
 * @class
 * @extends Component
 */
export class Registration extends Component {
    constructor() {
        super({});
    }

    #toggleForm = () => {
        const submitButton = document.getElementById("register-submit-button") as HTMLButtonElement;
        if (submitButton) submitButton.disabled = !submitButton.disabled;
    };

    /**
     * form submit event handler
     * @param {Event} event
     */
    #formSubmit = (event: SubmitEvent) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);

        if (validateForm(event.target as HTMLFormElement)) {
            requestManager.request(registerUser, formData, warningMsg);
        }
    };

    render() {
        return (
            <div>
                <h2 className="auth__title">Регистрация</h2>

                <form className="auth__form" onSubmit={(e) => this.#formSubmit(e as unknown as SubmitEvent)}>
                    <div id="common-warning" className="warning"></div>
                    <div className="input-group">
                        <label htmlFor="nickname">Имя</label>
                        <input name="nickname" className="form-input" />
                        <div className="warning"></div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Почта</label>
                        <input type="email" name="email" className="form-input" />
                        <div className="warning"></div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Пароль</label>
                        <input type="password" name="password" className="form-input" />
                        <div className="warning"></div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="passwordConfirmation">Подтверждения пароля</label>
                        <input type="password" name="passwordConfirmation" className="form-input" />
                        <div className="warning"></div>
                    </div>

                    <div className="input-group input-group-inline">
                        <input name="accept" type="checkbox" onChange={this.#toggleForm} />
                        <label htmlFor="accept">Я согласен с обработкой персональных данных</label>
                    </div>

                    <div className="submit-group">
                        <input
                            type="button"
                            value="Вход"
                            className="link-button"
                            onClick={() => store.dispatch(openLogin())}
                        />
                        <input
                            disabled={true}
                            type="submit"
                            value="Регистрация"
                            className="button"
                            id="register-submit-button"
                        />
                    </div>
                </form>
            </div>
        );
    }
}
