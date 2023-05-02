/** @module Components */

import { store } from "flux";
import { setOrgEventsLoadStart } from "flux/slices/eventSlice";
import { VDOM, Component } from "modules/vdom";
import { requestManager } from "requests";
import { LoadStatus } from "requests/LoadStatus";
import { loadEventPageOrgEvents } from "requests/events";

export class OrgEvents extends Component {
    didCreate() {
        store.dispatch(setOrgEventsLoadStart());

        requestManager.request(loadEventPageOrgEvents);
    }

    render() {
        const { orgEvents } = store.state.events;

        if (orgEvents.loadStatus === LoadStatus.ERROR) {
            return <div> Error </div>;
        }

        if (orgEvents.loadStatus !== LoadStatus.DONE) {
            return <div> LOADING </div>;
            // return <EventListLoading size={6} />;
        }

        return (
            <div className="event-list">
                {/* {cardsProps.map((props) => (
                    <EventCard {...props} />
                ))} */}
            </div>
        );
    }
}
