import { VDOM, Component } from "modules/vdom";

import { store } from "flux";
import { ModalWindowName, close } from "flux/slices/modalWindowSlice";
import "./styles.scss";
import { Registration } from "components/Auth/Registration/Registration";
import { Login } from "components/Auth/Login/Login";
import { FriendList } from "components/Auth/Profile/FriendList/FriendList";
import { CityPicker } from "components/CityPicker/CityPicker";
import { OrganizerModal } from "components/Auth/OrganizerModal/OrganizerModal";
import { toEvent } from "modules/CastEvents";

/**
 * Modal window component
 * @class
 * @extends Component
 */
export class ModalWindow extends Component {
    constructor() {
        super({});
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
        const getContent = () => {
            switch (store.state.modalWindow.name) {
                case ModalWindowName.LOGIN:
                    return <Login />;
                case ModalWindowName.REGISTER:
                    return <Registration />;
                case ModalWindowName.FRIEND_LIST:
                    return <FriendList />;
                case ModalWindowName.CITY_SELECTOR:
                    return <CityPicker />;
                case ModalWindowName.ORGANIZER:
                    return <OrganizerModal />;
            }
        };

        return (
            <div className="modal" onMouseDown={this.handleOutModalMouseDown}>
                <div className="modal__form__container" onMouseDown={(e) => this.handleInModalMouseDown(toEvent(e))}>
                    {getContent()}
                </div>
            </div>
        );
    }
}
