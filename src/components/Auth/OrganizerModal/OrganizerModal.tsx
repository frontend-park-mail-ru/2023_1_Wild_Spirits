import { VDOM, Component } from "modules/vdom";

export class OrganizerModal extends Component {
    constructor() {
        super({});
    }

    /**
     * Form submit event handler
     * @param {Event} event
     */
         #formSubmit = (event: SubmitEvent) => {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);
    
            // if (event.target) {
            //     if (validateForm(event.target as HTMLFormElement)) {
            //         requestManager.request(loginUser, formData, warningMsg);
            //     }
            // }
        };

    render(): JSX.Element {
        return (
            <div className="organizer-modal">
                <div className="organizer-modal__header">

                </div>
                <form className="auth__form" onSubmit={(e) => this.#formSubmit(e as unknown as SubmitEvent)}>
                    <div id="common-warning" className="warning"></div>
                    <div className="input-group">
                        <label htmlFor="email">Почта</label>
                        <input name="email" className="form-input" />
                        <div className="warning"></div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Пароль</label>
                        <input type="password" name="password" className="form-input" />
                        <div className="warning"></div>
                    </div>

                    <div className="submit-group">
                        <a className="link-button" onClick={() => store.dispatch.bind(store)(openRegister())}>
                            Регистрация
                        </a>
                        <input type="submit" value="Вход" className="button" />
                    </div>
                </form>
            </div>
        )
    }
};
