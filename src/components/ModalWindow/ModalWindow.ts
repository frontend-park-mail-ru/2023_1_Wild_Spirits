import { Component, ComponentParentType } from "components/Component";
import ModalWindowTemplate from "templates/ModalWindow/ModalWindow.handlebars";

import { store } from "flux";
import { close } from "flux/slices/modalWindowSlice";
import "./styles.scss";
import { router } from "modules/router";

/**
 * Modal window component
 * @class
 * @extends Component
 */
export class ModalWindow extends Component {
    #content: any;

    constructor(parent: ComponentParentType) {
        super(parent);

        this.registerEvent(
            () => document.getElementsByClassName("modal")[0] as HTMLElement,
            "click",
            () => store.dispatch.bind(store)(close())
        );
        this.registerEvent(
            () => document.getElementsByClassName("modal__form__container")[0] as HTMLElement,
            "click",
            this.#stopEventPropagation
        );
        this.registerEvent(
            ()=>document.getElementsByClassName("modalClosing"),
            "click",
            (event) => {
                event.preventDefault();
                const currentTarget = event.currentTarget as HTMLLinkElement;
                store.dispatch.bind(store)(close());
                router.go(currentTarget.href);
            }
        )
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
