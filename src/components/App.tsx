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
import { loadEvents } from "requests/events";

import { ModalWindowName } from "flux/slices/modalWindowSlice";

import { loadAuthorization } from "requests/user";
import { requestManager } from "requests/index";
import { loadTags } from "requests/tags";
import { ModalWindow } from "./ModalWindow/ModalWindow";
import { EventProcessing } from "./Events/EventProcessing/EventProcessing";
import { EventProcessingType } from "models/Events";
import { store } from "flux";
import { Map } from "./Map/Map";

import { ProfilePage } from "./Auth/Profile/ProfilePage";
import { createCollapsed, setCollapsed } from "flux/slices/metaSlice";
import { deepEqual } from "modules/objectsManipulation";
import { EventListPage } from "./Events/EventList/EvenListPage";

/**
 * @classdesc Main app component
 * @class
 * @extends Component
 */
export class App extends Component {
    didCreate(): void {
        requestManager.request(loadAuthorization);
        requestManager.request(loadTags);
        window.addEventListener("resize", () => {
            const collapsed = createCollapsed();
            if (!deepEqual(collapsed, store.state.meta.collapsed)) {
                store.dispatch(setCollapsed(collapsed));
            }
        });
    }

    willDestroy(): void {}

    render(): JSX.Element {
        router.reset();
        const url = router.getNextUrl();

        const EventsNotFound = () => {
            return (
                <div className="event-list-empty">
                    <div className="event-list-empty__text">Мероприятия по данным критериям не найдены</div>
                </div>
            );
        };

        const modalWindowShown = store.state.modalWindow.name !== ModalWindowName.NONE;

        return (
            <div className="app">
                <div className="header">
                    <Header />
                </div>

                <div className="content">
                    {url === "/" && <EventListPage />}
                    {url === "/events" && <EventPage />}
                    {url === "/profile" && <ProfilePage />}
                    {url === "/createevent" && <EventProcessing type={EventProcessingType.CREATE} />}
                    {url === "/editevent" && <EventProcessing type={EventProcessingType.EDIT} />}
                    {url === "/map" && <Map />}
                </div>
                {modalWindowShown && <ModalWindow />}
            </div>
        );
    }
}
