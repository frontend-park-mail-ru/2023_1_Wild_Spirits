import { VDOM, Component } from "modules/vdom";
import { EventList, EventListProps } from "./EventList";
import { isAuthorized } from "flux/slices/userSlice";
import { store } from "flux";
import { EventCreateButton } from "../EventCreateButton/EventCreateButton";
import { Calendar } from "components/Calendar/Calendar";
import { Tags } from "components/Tags/Tags";
import { toggleTag } from "flux/slices/tagsSlice";
import { requestManager } from "requests";
import { Link } from "components/Common/Link";
import { loadEvents } from "requests/events";

const GoMapBtn = () => {
    return (
        <div className="full-button-link-container">
            <Link href="/map" className="full-button-link js-router-link">
                Поиск по карте
            </Link>
        </div>
    );
};

export class EventListPage extends Component {
    render() {
        return (
            <div className="row">
                <EventList request={loadEvents} events={store.state.events.cards} />
                <div className="sidebar">
                    {isAuthorized(store.state.user) && <EventCreateButton />}
                    <GoMapBtn />
                    <Calendar />

                    <Tags
                        tagsState={store.state.tags}
                        toggleTag={(tag) => {
                            store.dispatch(toggleTag(tag));
                            requestManager.request(loadEvents);
                        }}
                    />
                </div>
            </div>
        );
    }
}
