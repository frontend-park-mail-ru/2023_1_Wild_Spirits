/** @module Components */

import { VDOM, Component } from "modules/vdom";

import { EventList } from "components/Events/EventList/EventList";
import { EventPage } from "components/Events/EventPage/EventPage";
import { Header } from "components/Header/Header";
import { Profile } from "./Auth/Profile/Profile";
import { FriendListCard } from "./Auth/Profile/FriendList/FriendListCard";
import { Calendar } from "./Calendar/Calendar";
import { Tags } from "./Tags/Tags";
import { EventCreateButton } from "./Events/EventCreateButton/EventCreateButton";

import { router } from "modules/router";
import { loadEvents, loadLikedEvents } from "requests/events";

import { ModalWindowName, openOrganizerModal } from "flux/slices/modalWindowSlice";
import { isAuthorized } from "flux/slices/userSlice";

import { loadAuthorization, loadFriends } from "requests/user";
import { requestManager } from "requests/index";
import { loadTags } from "requests/tags";
import { ModalWindow } from "./ModalWindow/ModalWindow";
import { EventProcessing } from "./Events/EventProcessing/EventProcessing";
import { EventProcessingType } from "models/Events";
import { store } from "flux";
import { toggleTag } from "flux/slices/tagsSlice";
import { Link } from "./Common/Link";
import { Loading } from "./Common/Loading";
import { Map } from "./Map/Map";
// import { SidebarTags } from "./Tags/SidebarTags";

import { SVGInline } from "./Common/SVGInline";

/**
 * @classdesc Main app component
 * @class
 * @extends Component
 */
export class App extends Component<any> {
    constructor() {
        super({});
    }

    didCreate(): void {
        console.error("App Created");
        requestManager.request(loadAuthorization);
        requestManager.request(loadTags);

        // addRouterEvents();
    }

    willDestroy(): void {
        console.error("Add Destroy");
    }

    render(): JSX.Element {
        router.reset();
        const url = router.getNextUrl();

        const getProfileId = () => {
            const url = router.getNextUrl();
            return parseInt(url.slice(1));
        };

        const GoMapBtn = () => {
            return (
                <div className="full-button-link-container">
                    <Link href="/map" className="full-button-link js-router-link">
                        Поиск по карте
                    </Link>
                </div>
            );
        };

        const modalWindowShown = store.state.modalWindow.name !== ModalWindowName.NONE;

        return (
            <div className="app">
                <div className="header">
                    <Header />
                </div>

                <div className="row">
                    <div className="content">
                        {url === "/" && <EventList request={loadEvents} />}
                        {url === "/events" && <EventPage />}
                        {url === "/profile" &&
                            (() => {
                                const profileId = getProfileId();
                                return (
                                    <div>
                                        <Profile id={profileId} />
                                        <EventList request={loadLikedEvents} requestArgs={[profileId]} />
                                    </div>
                                );
                            })()}
                        {url === "/createevent" && <EventProcessing type={EventProcessingType.CREATE} />}
                        {url === "/editevent" && <EventProcessing type={EventProcessingType.EDIT} />}
                        {url === "/map" && <Map />}
                    </div>
                    <div className="sidebar">
                        {url === "/profile" && <FriendListCard />}
                        {(url === "/" || url === "/profile") && <EventCreateButton />}
                        {url === "/" && <GoMapBtn />}
                        {(url === "/" || url === "/profile") && <Calendar />}
                        {url === "/" && (
                            <Tags
                                tagsState={store.state.tags}
                                toggleTag={(tag) => {
                                    store.dispatch(toggleTag(tag));
                                    requestManager.request(loadEvents);
                                }}
                            />
                        )}
                    </div>
                </div>
                {modalWindowShown && <ModalWindow />}
            </div>
        );
    }
}
