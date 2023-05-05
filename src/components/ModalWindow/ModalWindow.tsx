import { VDOM, Component } from "modules/vdom";

import { store } from "flux";
import { closeModal } from "flux/slices/modalWindowSlice";

interface ModalWindowProps {
    children?: JSX.Element | JSX.Element[];
}

/**
 * Modal window component
 * @class
 * @extends Component
 */
export class ModalWindow extends Component<ModalWindowProps> {
    constructor(props: ModalWindowProps) {
        super(props);
    }

    /**
     * Stops event propagation for modal window not closing at clicking modal form
     * @param {Event} event
     */
    handleInModalMouseDown(event: Event) {
        event.stopPropagation();
    }

    handleOutModalMouseDown() {
        store.dispatch(closeModal());
    }

    render(): JSX.Element {
        return (
            <div className="modal" onMouseDown={this.handleOutModalMouseDown}>
                {Array.isArray(this.props.children)
                    ? this.props.children.map((child) => child).flat()
                    : this.props.children}
            </div>
        );
    }
}
