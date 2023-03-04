import { Component } from '/components/Component.js';
import ModalWindowTemplate from '/compiled/ModalWindow/ModalWindow.handlebars.js';

export class ModalWindow extends Component {

    #onEscape;
    constructor(parent, onEscape) {
        super(parent)

        this.#onEscape = onEscape;

        this.registerEvent(()=>document.getElementsByClassName('modal')[0], 'click', this.#onEscape);
        this.registerEvent(()=>document.getElementsByClassName('modal__form__container')[0], 'click', this.#stopEventPropagation);
    }

    #stopEventPropagation = (e) => e.stopPropagation();

    render(content) {
        return ModalWindowTemplate({modal_content: content});
    }
}
