import { VDOM, Component } from "modules/vdom";
import { Link } from "components/Common/Link";
import { store } from "flux";
import { openOrganizerModal } from "flux/slices/modalWindowSlice";
import { isAuthorizedOrNotDone } from "flux/slices/userSlice";

export class EventCreateButton extends Component {
    render() {
        const { authorized } = store.state.user;
        const isOrganizer = isAuthorizedOrNotDone(authorized) && authorized.data.organizer_id !== undefined;
        return (
            <div className="full-button-link-container">
                {isOrganizer ? (
                    <Link href="/createevent" className="full-button-link js-router-link">
                        Создать мероприятие
                    </Link>
                ) : (
                    <input
                        className="full-button-link"
                        onClick={() => {
                            store.dispatch(openOrganizerModal());
                        }}
                        value="Создать мероприятие"
                    />
                )}
            </div>
        );
    }
}
