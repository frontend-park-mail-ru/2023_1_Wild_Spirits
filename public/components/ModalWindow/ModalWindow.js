import { Component } from '/components/Component.js';
import ModalWindowTemplate from '/compiled/ModalWindow/ModalWindow.handlebars.js';

export class ModalWindow extends Component {

    #onEscape;
    constructor(parent, onEscape) {
        super(parent)

        this.#onEscape = onEscape;
    }

    #stopEventPropagation = (e) => e.stopPropagation();

    removeEvents() {
        const modal = document.getElementsByClassName('modal')[0];

        if (modal) {
            modal.removeEventListener('click', this.#onEscape);

            const form = document.getElementsByClassName('modal__form__container')[0];
            form.removeEventListener('click', this.#stopEventPropagation);
        }
    }

    addEvents() {
        const modal = document.getElementsByClassName('modal')[0];

        if (modal) {
            modal.addEventListener('click', this.#onEscape);

            const form = document.getElementsByClassName('modal__form__container')[0];
            form.addEventListener('click', this.#stopEventPropagation);
        }
    }

    render(content) {
        return ModalWindowTemplate({modal_content: content});
    }
}
