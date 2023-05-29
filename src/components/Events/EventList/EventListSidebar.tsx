import { VDOM } from "modules/vdom";
import { store } from "flux";
import { isAuthorized } from "flux/slices/userSlice";
import { EventCreateButton } from "../EventCreateButton/EventCreateButton";
import { Calendar } from "components/Calendar/Calendar";
import { Tags } from "components/Tags/Tags";
import { requestManager } from "requests";
import { loadEvents } from "requests/events";
import { setEventsCardsLoadStart } from "flux/slices/eventSlice";
import { toggleTag } from "flux/slices/tagsSlice";
import { Link } from "components/Common/Link";

const GoMapBtn = () => {
    return (
        <div className="full-button-link-container">
            <Link href="/map" className="full-button-link">
                Поиск по карте
            </Link>
        </div>
    );
};

export const EventListSidebar = () => {
    return (
        <div className="col sidebar">
            {isAuthorized(store.state.user) && <EventCreateButton />}
            <GoMapBtn />
            <Calendar />

            <Tags
                tagsState={store.state.tags}
                toggleTag={(tag) => {
                    store.dispatch(toggleTag(tag), setEventsCardsLoadStart());
                    requestManager.request(loadEvents);
                }}
            />
        </div>
    );
};
