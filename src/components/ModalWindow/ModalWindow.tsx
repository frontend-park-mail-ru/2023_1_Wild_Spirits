import { VDOM, Component } from "modules/vdom";

import { store } from "flux";
import { ModalWindowName, close } from "flux/slices/modalWindowSlice";
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
        const isTypeOf = (typeName: ModalWindowName.NameType) => store.state.modalWindow.name === typeName;

        return (
            <div className="modal" onMouseDown={this.handleOutModalMouseDown}>
                <div className="modal__form__container" onMouseDown={(e) => this.handleInModalMouseDown(toEvent(e))}>
                    {isTypeOf(ModalWindowName.LOGIN) && <Login />}
                    {isTypeOf(ModalWindowName.REGISTER) && <Registration />}
                    {isTypeOf(ModalWindowName.FRIEND_LIST) && <FriendList />}
                    {isTypeOf(ModalWindowName.CITY_SELECTOR) && <CityPicker />}
                    {isTypeOf(ModalWindowName.ORGANIZER) && <OrganizerModal />}
                </div>
            </div>
        );
    }
}
