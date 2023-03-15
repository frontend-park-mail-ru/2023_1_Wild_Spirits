import { Component } from "components/Component";
import ModalWindowTemplate from "compiled/ModalWindow/ModalWindow.handlebars";

/**
 * Modal window component
 * @class
 * @extends Component
 */
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

    /**
     * Stops event propagation for modal window not closing at clicking modal form
     * @param {Event} e
     */
    #stopEventPropagation = (e) => e.stopPropagation();

    render(content) {
        return ModalWindowTemplate({ modal_content: content });
    }
}
