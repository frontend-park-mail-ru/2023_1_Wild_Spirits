import { Component, VDOM } from "modules/vdom";
import { Profile } from "./Profile";
import { router } from "modules/router";
import { store } from "flux";
import { FriendListCard } from "./FriendList/FriendListCard";
import { EventCreateButton } from "components/Events/EventCreateButton/EventCreateButton";
import { EventsTab } from "components/Events/EventsTab/EventsTab";
import { loadProfileEvents } from "components/Common/Link";
import { clearOrgEvents } from "flux/slices/eventSlice";

export class ProfilePage extends Component {
    didCreate(): void {
        loadProfileEvents();
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

        return (
            <div className="row">
                <div className="col-m-12 col-xl-12 col-xxl-8 col-9">
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
                    <div className="col-xxl-4 col-3 sidebar">
                        <FriendListCard />
                        <EventCreateButton />
                    </div>
                )}
                <div className="col-12">
                    <EventsTab />
                </div>
            </div>
        );
    }
}
