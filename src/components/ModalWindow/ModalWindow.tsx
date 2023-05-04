import { VDOM, Component } from "modules/vdom";

import { store } from "flux";
import { ModalWindowName, close } from "flux/slices/modalWindowSlice";
import { Registration } from "components/Auth/Registration/Registration";
import { Login } from "components/Auth/Login/Login";
import { FriendList } from "components/Auth/Profile/FriendList/FriendList";
import { CityPicker } from "components/CityPicker/CityPicker";
import { OrganizerModal } from "components/Auth/OrganizerModal/OrganizerModal";
import { toEvent } from "modules/CastEvents";

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
        store.dispatch(close());
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
