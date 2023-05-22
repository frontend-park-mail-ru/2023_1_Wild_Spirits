import { VDOM } from "modules/vdom";
import { ModalWindow } from "./ModalWindow";
import { ModalWindowName, closeModal } from "flux/slices/modalWindowSlice";
import { Login } from "components/Auth/Login/Login";
import { Registration } from "components/Auth/Registration/Registration";
import { FriendList } from "components/Auth/Profile/FriendList/FriendList";
import { CityPicker } from "components/CityPicker/CityPicker";
import { OrganizerModal } from "components/Auth/OrganizerModal/OrganizerModal";
import { store } from "flux";
import { toEvent } from "modules/CastEvents";
import { NotificationModal } from "components/Notification/NotificationModal";
import { InviteModal } from "components/Notification/InviteModal";

export class MainModalWindow extends ModalWindow {
    constructor() {
        const isTypeOf = (typeName: ModalWindowName.NameType) => store.state.modalWindow.name === typeName;

        super({
            children: (
                <div className="modal__form__container" onMouseDown={(e) => this.handleInModalMouseDown(toEvent(e))}>
                    <div className="modal__close-button" onClick={() => store.dispatch(closeModal())}>
                        <img className="modal__close-img pointy" src="/assets/img/close-icon.svg" />
                    </div>
                    {isTypeOf(ModalWindowName.LOGIN) && <Login />}
                    {isTypeOf(ModalWindowName.REGISTER) && <Registration />}
                    {isTypeOf(ModalWindowName.FRIEND_LIST) && <FriendList />}
                    {isTypeOf(ModalWindowName.CITY_SELECTOR) && <CityPicker />}
                    {isTypeOf(ModalWindowName.ORGANIZER) && <OrganizerModal />}
                    {isTypeOf(ModalWindowName.NOTIFICATION) && <NotificationModal />}
                    {isTypeOf(ModalWindowName.INVITE) && <InviteModal />}
                </div>
            ),
        });
    }
}
