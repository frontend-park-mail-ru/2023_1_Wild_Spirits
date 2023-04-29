import { VDOM, Component } from "modules/vdom";
import { Link } from "components/Common/Link";
import { store } from "flux";
import { openOrganizerModal } from "flux/slices/modalWindowSlice";

export class EventCreateButton extends Component {
    render() {
        const isOrganizer = store.state.user.data?.organizer_id !== undefined;
        return (
            <div className="full-button-link-container">
                {
                    isOrganizer
                    ? <Link href="/createevent" className="full-button-link js-router-link" onClick={() => {}}>
                          Создать мероприятие
                      </Link>
                    : <input className="full-button-link" 
                        onClick={() => {store.dispatch(openOrganizerModal())}}
                        value="Создать мероприятие"
                />
                }
            </div>
        )
    }
}
