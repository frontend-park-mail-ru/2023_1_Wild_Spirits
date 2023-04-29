import { VDOM, Component } from "modules/vdom";

import { store } from "flux";
import { requestManager } from "requests";
import { registerOrganizer } from "requests/user";

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

        if (!event.target) {
            return;
        }

        const formData = new FormData(event.target as HTMLFormElement);

        for (const el of formData) {
            console.log(el)
        }

        requestManager.request(registerOrganizer, formData);

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
                    Создавать мероприятия могут только организаторы. Чтобы стать организатором, заполните следующие поля:
                </div>

                <form className="auth__form" onSubmit={(e) => this.#formSubmit(e as unknown as SubmitEvent)}>
                    <div id="common-warning" className="warning"></div>
                    <div className="input-group">
                        <label htmlFor="phone">Номер телефона</label>
                        <input name="phone" className="form-input" />
                        <div className="warning"></div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="website">Ссылка на сайт</label>
                        <input type="text" name="website" className="form-input" />
                        <div className="warning"></div>
                    </div>

                    <div className="submit-group">
                        <input type="submit" value="Стать организатором" className="button" />
                    </div>
                </form>
            </div>
        )
    }
};
