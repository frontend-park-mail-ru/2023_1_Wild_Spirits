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
import {
    loadEvents,
    loadPlannedEvents,
    loadLikedEvents,
    loadProfileOrgEvents,
    loadSubbedEvents,
} from "requests/events";

import { ModalWindowName, openOrganizerModal } from "flux/slices/modalWindowSlice";
import { isAuthorized, isOrganizer } from "flux/slices/userSlice";

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

import { LoadStatus } from "requests/LoadStatus";
import { TEventLight } from "models/Events";

import { SVGInline } from "./Common/SVGInline";
import { OrgEvents } from "./Events/OrgEvents/OrgEvents";
import { EventsState, hasEvents, hasNotLoaded } from "flux/slices/eventSlice";

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
        requestManager.request(loadAuthorization);
        requestManager.request(loadTags);
    }

    render(): JSX.Element {
        router.reset();
        const url = router.getNextUrl();

        const getProfileId = () => {
            const url = router.getNextUrlNotRemove();
            if (url === undefined) {
                return -1;
            }
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

        const Delimiter = (props: { content: string }) => {
            return (
                <div className="delimiter">
                    <hr />
                    <div className="delimiter__content">{props.content}</div>
                    <hr />
                </div>
            );
        };

        const EventsNotFound = () => {
            return (
                <div className="event-list-empty">
                    <div className="event-list-empty__text">Мероприятия по данным критериям не найдены</div>
                </div>
            );
        };

        const modalWindowShown = store.state.modalWindow.name !== ModalWindowName.NONE;
        const profileId = getProfileId();

        return (
            <div className="app">
                <div className="header">
                    <Header />
                </div>

                <div className="row">
                    <div className="content">
                        {url === "/" && <EventList request={loadEvents} events={store.state.events.cards} />}
                        {url === "/events" && <EventPage />}
                        {url === "/profile" && (
                            <div>
                                <Profile id={profileId} />

                                {hasEvents(store.state.events.subbedEvents) && (
                                    <Delimiter content="Мероприятия подписок" />
                                )}
                                <EventList
                                    request={loadSubbedEvents}
                                    requestArgs={[profileId]}
                                    events={store.state.events.subbedEvents}
                                />

                                {isOrganizer(store.state.user) && hasEvents(store.state.events.orgEvents) && (
                                    <Delimiter content="Мероприятия данного организатора" />
                                )}
                                <EventList
                                    request={loadProfileOrgEvents}
                                    requestArgs={[]}
                                    events={store.state.events.orgEvents}
                                />

                                {hasEvents(store.state.events.plannedEvents) && (
                                    <Delimiter content="Запланированные мероприятия" />
                                )}
                                <EventList
                                    request={loadPlannedEvents}
                                    requestArgs={[profileId]}
                                    events={store.state.events.plannedEvents}
                                />

                                {hasEvents(store.state.events.likedEvents) && (
                                    <Delimiter content="Понравившиеся мероприятия" />
                                )}
                                <EventList
                                    request={loadLikedEvents}
                                    requestArgs={[profileId]}
                                    events={store.state.events.likedEvents}
                                />
                            </div>
                        )}
                        {url === "/createevent" && <EventProcessing type={EventProcessingType.CREATE} />}
                        {url === "/editevent" && <EventProcessing type={EventProcessingType.EDIT} />}
                        {url === "/map" && <Map />}
                    </div>
                    <div className="sidebar">
                        {url === "/events" && <OrgEvents />}

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
