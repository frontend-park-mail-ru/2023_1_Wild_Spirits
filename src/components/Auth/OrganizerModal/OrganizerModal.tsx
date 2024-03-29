import { VDOM, Component } from "modules/vdom";

import { requestManager } from "requests";
import { registerOrganizer } from "requests/user";

import { toSubmitEvent } from "modules/CastEvents";
import { InputField } from "components/Form/FormBase";

type OrganizerModalErrors = { phone?: string; website?: string };

export class OrganizerModal extends Component<any, { errors: OrganizerModalErrors }> {
    setErrors;
    constructor() {
        super({});
        this.state = { errors: {} };

        this.setErrors = this.#setErrors.bind(this);
    }

    validateFormData(formData: FormData): OrganizerModalErrors {
        const errors: OrganizerModalErrors = {};

        const phone = formData.get("phone") as string;
        if (phone.length === 0) {
            errors.phone = "Телефон не указан";
        }

        return errors;
    }

    #setErrors(errs: { errorMsg: string; errors: { [key: string]: string } }) {
        this.setState({ errors: errs.errors });
    }

    /**
     * Form submit event handler
     * @param {Event} event
     */
    #handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();

        if (!event.target) {
            return;
        }

        const formData = new FormData(event.target as HTMLFormElement);

        const errors = this.validateFormData(formData);

        if (Object.entries(errors).length !== 0) {
            this.setState({ errors });
            return;
        }

        requestManager.request(registerOrganizer, formData, (err) => this.setErrors(err));
    };

    render(): JSX.Element {
        return (
            <div className="organizer-modal">
                <div className="organizer-modal__header">
                    <span>Создавать мероприятия могут только организаторы.</span>
                    <span>Чтобы стать организатором, заполните следующие поля:</span>
                </div>

                <form className="auth__form" onSubmit={(e) => this.#handleSubmit(toSubmitEvent(e))}>
                    <InputField
                        prefix="organizer"
                        fieldName="phone"
                        type="text"
                        value=""
                        title="Телефон"
                        required
                        errorMsg={this.state.errors["phone"]}
                    />

                    <InputField
                        prefix="organizer"
                        fieldName="website"
                        type="text"
                        value=""
                        title="Сайт"
                        errorMsg={this.state.errors["website"]}
                    />

                    <div className="submit-group">
                        <input type="submit" value="Стать организатором" className="button" />
                    </div>
                </form>
            </div>
        );
    }
}
