import { Component, VDOM } from "modules/vdom";
import { Profile } from "./Profile";
import { router } from "modules/router";
import { store } from "flux";
import { FriendListCard } from "./FriendList/FriendListCard";
import { EventCreateButton } from "components/Events/EventCreateButton/EventCreateButton";
import { loadProfileEvents } from "components/Common/Link";
import { clearOrgEvents } from "flux/slices/eventSlice";
import { EventList } from "components/Events/EventList/EventList";
import { FriendPreview } from "./FriendList/FriendPreview";
import { requestManager } from "requests";
import { loadOrganizers } from "requests/user";
import { mineProfile } from "flux/slices/userSlice";

export class ProfilePage extends Component {
    didCreate(): void {
        loadProfileEvents();
        requestManager.request(loadOrganizers);
    }

    willDestroy(): void {
        store.dispatch(clearOrgEvents());
    }

    getProfileId = () => {
        const url = router.getNextUrlNotRemove();
        if (url === undefined) {
            return -1;
        }
        return parseInt(url.slice(1));
    };

    render() {
        const profileId = this.getProfileId();

        const orgs = store.state.user.recommended;

        const orgEvents = store.state.events.orgEvents;
        const cardClassName = "col-12 col-s-6 col-m-12 col-xl-4 col-xxl-3 event-card-container";

        const isMine = mineProfile(store.state.user);

        return (
            <div className="row profile-page">
                <div className="col-9 col-m-12 col-xl-12 col-xxl-8 ">
                    <div className="profile-page__content">
                        <Profile id={profileId} />

                        {store.state.meta.collapsed.profileCollapsed && (
                            <div className="profile-page__extra-block ">
                                <FriendListCard />
                                <EventCreateButton />
                            </div>
                        )}
                    </div>
                </div>
                {!store.state.meta.collapsed.profileCollapsed && (
                    <div className="col-3 col-xxl-4">
                        <FriendListCard />
                        <EventCreateButton />
                    </div>
                )}
                {isMine && (
                    <div className="col-12 profile-page__rec">
                        <div className="event-carousel__title">Рекомендации</div>
                        <div className="row gap-row">
                            {orgs &&
                                orgs.map((org) => (
                                    <div className="col-12 col-s-6 col-m-6 col-xl-4 col-xxl-3 event-card-container">
                                        <FriendPreview
                                            user_id={org.id}
                                            avatar={org.img}
                                            name={org.name}
                                            is_friend={false}
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
                <div className="col-12">
                    <div className="event-carousel__title">Мои мероприятия</div>
                    <EventList events={orgEvents} cardClassName={cardClassName} />
                </div>
                {/* <EventsTab /> */}
            </div>
        );
    }
}
