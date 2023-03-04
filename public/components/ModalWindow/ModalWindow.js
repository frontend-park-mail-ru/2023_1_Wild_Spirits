import { Component } from "/components/Component.js";
import ModalWindowTemplate from "/compiled/ModalWindow/ModalWindow.handlebars.js";

export class ModalWindow extends Component {
    #escapeModal;

    constructor(parent, escapeModal) {
        super(parent);

        this.#escapeModal = escapeModal;

        this.registerEvent(() => document.getElementsByClassName("modal")[0], "click", this.#escapeModal);
        this.registerEvent(
            () => document.getElementsByClassName("modal__form__container")[0],
            "click",
            this.#stopEventPropagation
        );
    }

    #stopEventPropagation = (e) => e.stopPropagation();

    render(content) {
        return ModalWindowTemplate({ modal_content: content });
    }
}
