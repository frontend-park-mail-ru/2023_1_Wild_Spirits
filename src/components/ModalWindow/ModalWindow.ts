import { Component, ComponentParentType } from "components/Component";

// @ts-ignore
import ModalWindowTemplate from "templates/ModalWindow/ModalWindow.handlebars";

/**
 * Modal window component
 * @class
 * @extends Component
 */
export class ModalWindow extends Component {
    #escapeModal;
    #content: any;

    constructor(parent: ComponentParentType, escapeModal: any) {
        super(parent);

        this.#escapeModal = escapeModal;

        this.registerEvent(
            () => document.getElementsByClassName("modal")[0] as HTMLElement,
            "click",
            this.#escapeModal
        );
        this.registerEvent(
            () => document.getElementsByClassName("modal__form__container")[0] as HTMLElement,
            "click",
            this.#stopEventPropagation
        );
    }

    set content(content: any) {
        this.#content = content;
    }

    /**
     * Stops event propagation for modal window not closing at clicking modal form
     * @param {Event} event
     */
    #stopEventPropagation = (event: Event) => event.stopPropagation();

    render() {
        return ModalWindowTemplate({ modal_content: this.#content });
    }
}
