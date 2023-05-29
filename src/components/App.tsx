/** @module Components */

import { VDOM, Component } from "modules/vdom";

import { EventPage } from "components/Events/EventPage/EventPage";
import { Header } from "components/Header/Header";

import { router } from "modules/router";

import { ModalWindowName } from "flux/slices/modalWindowSlice";

import { loadAuthorization } from "requests/user";
import { requestManager } from "requests/index";
import { loadTags } from "requests/tags";
import { EventProcessing } from "./Events/EventProcessing/EventProcessing";
import { EventProcessingType } from "models/Events";
import { store } from "flux";
import { Map } from "./Map/Map";

import { ProfilePage } from "./Auth/Profile/ProfilePage";
import { createCollapsed, setCollapsed } from "flux/slices/metaSlice";
import { deepEqual } from "modules/objectsManipulation";
import { EventListPage } from "./Events/EventList/EvenListPage";
import { loadCategories, loadCities } from "requests/header";
import { SideMenu } from "./SideMenu/SideMenu";
import { CalendarModal } from "./Calendar/CalendarModal";
import { MainModalWindow } from "./ModalWindow/MainModalWindow";
import { createWebSocket, loadInvites } from "requests/notifications";
import { MainPage } from "./MainPage";

/**
 * @classdesc Main app component
 * @class
 * @extends Component
 */
export class App extends Component {
    didCreate(): void {
        requestManager.request(loadAuthorization);
        requestManager.request(loadTags);
        requestManager.request(loadCities);
        requestManager.request(loadCategories);
        requestManager.request(loadInvites);
        requestManager.request(createWebSocket);

        window.addEventListener("resize", () => {
            const collapsed = createCollapsed();
            if (!deepEqual(collapsed, store.state.meta.collapsed)) {
                store.dispatch(setCollapsed(collapsed));
            }
        });
    }

    render(): JSX.Element {
        router.reset();
        const url = router.getNextUrl();

        const modalWindowShown = store.state.modalWindow.name !== ModalWindowName.NONE;

        return (
            <div className="app">
                <div className="header">
                    <Header />
                </div>

                <div className="content main-content">
                    {url === "/" && <MainPage />}
                    {url === "/eventslist" && <EventListPage />}
                    {url === "/events" && <EventPage />}
                    {url === "/profile" && <ProfilePage />}
                    {url === "/createevent" && <EventProcessing type={EventProcessingType.CREATE} />}
                    {url === "/editevent" && <EventProcessing type={EventProcessingType.EDIT} />}
                    {url === "/map" && <Map />}
                </div>
                {modalWindowShown && <MainModalWindow />}
                {store.state.sideMenu.isOpen && <SideMenu />}

                {store.state.modalWindow.name === ModalWindowName.CALENDAR && <CalendarModal />}
            </div>
        );
    }
}
