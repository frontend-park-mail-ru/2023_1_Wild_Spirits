/** @module Components */

import { VDOM, Component } from "modules/vdom";

import { EventList } from "components/Events/EventList/EventList";
import { EventPage } from "components/Events/EventPage/EventPage";
import { Header } from "components/Header/Header";
import { Profile } from "./Auth/Profile/Profile";
import { FriendListCard } from "./Auth/Profile/FriendList/FriendListCard";
import { Calendar } from "./Calendar/Calendar";

import { svgInliner } from "modules/svgLoader";
import { router } from "modules/router";

import { ModalWindowName } from "flux/slices/modalWindowSlice";
import { isAuthorized } from "flux/slices/userSlice";

import { loadAuthorization, loadFriends } from "requests/user";
import { requestManager } from "requests/index";
import { loadTags } from "requests/tags";
import { ModalWindow } from "./ModalWindow/ModalWindow";
import { EventProcessing } from "./Events/EventProcessing/EventProcessing";
import { EventProcessingType } from "models/Events";
import { store } from "flux";
// import { SidebarTags } from "./Tags/SidebarTags";

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

    render(): JSX.Element {
        router.reset();
        const url = router.getNextUrl();

        const getProfileId = () => {
            const url = router.getNextUrl();
            return parseInt(url.slice(1));
        };

        const CreateEventBtn = () => {
            return (
                <div className="full-button-link-container">
                    <a href="/createevent" className="full-button-link js-router-link">
                        Создать мероприятие
                    </a>
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
                        {url === "/" && <EventList />}
                        {url === "/events" && <EventPage />}
                        {url === "/profile" && [<Profile id={getProfileId()} />, <EventList />]}
                        {url === "/createevent" && <EventProcessing type={EventProcessingType.CREATE} />}
                        {url === "/editevent" && <EventProcessing type={EventProcessingType.EDIT} />}
                    </div>
                    <div className="sidebar">
                        {url === "/" && [<CreateEventBtn />, <Calendar />]}
                        {url === "/profile" && [<FriendListCard />, <CreateEventBtn />, <Calendar />]}
                    </div>
                </div>
                {modalWindowShown && <ModalWindow />}
            </div>
        );
    }
}
