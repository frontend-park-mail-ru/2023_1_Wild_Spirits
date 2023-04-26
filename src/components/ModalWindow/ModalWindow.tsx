import { VDOM, Component } from "modules/vdom";
import ModalWindowTemplate from "templates/ModalWindow/ModalWindow.handlebars";

import { store } from "flux";
import { ModalWindowName, close } from "flux/slices/modalWindowSlice";
import "./styles.scss";
import { router } from "modules/router";
import { Registration } from "components/Auth/Registration/Registration";
import { Login } from "components/Auth/Login/Login";
import { FriendList } from "components/Auth/Profile/FriendList/FriendList";

/**
 * Modal window component
 * @class
 * @extends Component
 */
export class ModalWindow extends Component {
    #content: any;

    constructor() {
        super({});
    }

    set content(content: any) {
        this.#content = content;
    }

    /**
     * Stops event propagation for modal window not closing at clicking modal form
     * @param {Event} event
     */
    #stopEventPropagation = (event: Event) => event.stopPropagation();

    render(): JSX.Element {
        const getContent = () => {
            switch (store.state.modalWindow.name) {
                case ModalWindowName.LOGIN:
                    return <Login />;
                case ModalWindowName.REGISTER:
                    return <Registration />;
                case ModalWindowName.FRIENDLIST:
                    return <FriendList />;
            }
        };

        return (
            <div className="modal" onClick={() => store.dispatch.bind(store)(close())}>
                <div
                    className="modal__form__container"
                    onClick={(e) => {
                        this.#stopEventPropagation(e as unknown as Event);
                    }}
                >
                    {getContent()}
                </div>
            </div>
        );
    }
}
