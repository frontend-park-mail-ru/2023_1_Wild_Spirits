import { Component, VDOM } from "modules/vdom";
import { Profile } from "./Profile";
import { EventList } from "components/Events/EventList/EventList";
import { router } from "modules/router";
import { hasEvents } from "flux/slices/eventSlice";
import { isOrganizer } from "flux/slices/userSlice";
import { store } from "flux";
import { loadLikedEvents, loadPlannedEvents, loadProfileOrgEvents, loadSubbedEvents } from "requests/events";
import { FriendListCard } from "./FriendList/FriendListCard";
import { EventCreateButton } from "components/Events/EventCreateButton/EventCreateButton";
import { Calendar } from "components/Calendar/Calendar";

const Delimiter = (props: { content: string }) => {
    return (
        <div className="delimiter">
            <hr />
            <div className="delimiter__content">{props.content}</div>
            <hr />
        </div>
    );
};

export class ProfilePage extends Component {
    getProfileId = () => {
        const url = router.getNextUrlNotRemove();
        if (url === undefined) {
            return -1;
        }
        return parseInt(url.slice(1));
    };

    render() {
        const profileId = this.getProfileId();

        return (
            <div className="row-old">
                <div className="profile-page__content">
                    <Profile id={profileId} />

                    {store.state.meta.collapsed.profileCollapsed && (
                        <div className="profile-page__sidebar">
                            <FriendListCard />
                            <EventCreateButton />
                        </div>
                    )}

                    {hasEvents(store.state.events.subbedEvents) && <Delimiter content="Мероприятия подписок" />}
                    <EventList request={loadSubbedEvents} events={store.state.events.subbedEvents} />

                    {isOrganizer(store.state.user) && hasEvents(store.state.events.orgEvents) && (
                        <Delimiter content="Мероприятия данного организатора" />
                    )}
                    <EventList request={loadProfileOrgEvents} events={store.state.events.orgEvents} />

                    {hasEvents(store.state.events.plannedEvents) && <Delimiter content="Запланированные мероприятия" />}
                    <EventList request={loadPlannedEvents} events={store.state.events.plannedEvents} />

                    {hasEvents(store.state.events.likedEvents) && <Delimiter content="Понравившиеся мероприятия" />}
                    <EventList request={loadLikedEvents} events={store.state.events.likedEvents} />
                </div>
                {!store.state.meta.collapsed.profileCollapsed && (
                    <div className="profile-page__sidebar">
                        <FriendListCard />
                        <EventCreateButton />
                        <Calendar />
                    </div>
                )}
            </div>
        );
    }
}
