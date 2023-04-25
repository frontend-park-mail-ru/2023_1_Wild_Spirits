/** @module Components */

import { createVNode, Component } from "modules/vdom";

import { EventList } from "components/Events/EventList/EventList";
import { EventPage } from "components/Events/EventPage/EventPage";
import { Header } from "components/Header/Header";
import { Profile } from "./Auth/Profile/Profile";
import { FriendListCard } from "./Auth/Profile/FriendList/FriendListCard";
import { Calendar } from "./Calendar/Calendar";

// import { Profile } from "./Auth/Profile/Profile";
import { svgInliner } from "modules/svgLoader";
import { router } from "modules/router";

import { ModalWindowName } from "flux/slices/modalWindowSlice";
import { isAuthorized } from "flux/slices/userSlice";
// import { EventPage } from "./Events/EventPage/EventPage";
// import { EventProcessing } from "./Events/EventProcessing/EventProcessing";

import { loadAuthorization, loadFriends } from "requests/user";
import { requestManager } from "requests/index";
import { loadTags } from "requests/tags";
import { ModalWindow } from "./ModalWindow/ModalWindow";
import { EventProcessing } from "./Events/EventProcessing/EventProcessing";
import { EventProcessingState } from "models/Events";
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

    // rerender() {
    //     removeRouterEvents();
    //     this.removeChildEvents();
    //     if (this.parent instanceof HTMLElement) {
    //         this.parent.innerHTML = this.render();
    //     }
    //     this.addChildEvents();
    //     svgInliner.applyRules();
    //     addRouterEvents();
    // }

    render(): JSX.Element {
        router.reset();
        const url = router.getNextUrl();

        const getProfileId = () => {
            const url = router.getNextUrl();
            return parseInt(url.slice(1));
        }

        const CreateEventBtn = () => {
            return (
                <div className="full-button-link-container">
                    <a href="/createevent" className="full-button-link js-router-link">
                        Создать мероприятие
                    </a>
                </div>
            );
        }

        return (
            // <div>
            //     <Header />
            //     {url === "/" && <EventList />}
            //     {url === "/events" && <EventPage />}
            //     {url === "/profile" && <Profile />}
            // </div>

            <div className="app">
                <div className="header">
                    <Header />
                </div>

                <div className="row">
                    <div className="content">
                        {url === "/" && <EventList />}
                        {url === "/events" && <EventPage />}
                        {url === "/profile" && [<Profile id={getProfileId()}/>, <EventList/>]}
                        {url === "/createevent" && <EventProcessing type={EventProcessingState.CREATE} />}
                    </div>
                    <div className="sidebar">
                        {url === "/" && [<CreateEventBtn/>, <Calendar/>]}
                        {url === "/profile" && [<FriendListCard/>, <CreateEventBtn/>, <Calendar/>]}
                    </div>
                </div>
                {/* <ModalWindow/> */}
            </div>
        );

        // const createEventBtn = () => {
        //     return isAuthorized(store.getState().user) ? CreateEventBtn() : "";
        // };

        // const { content, sidebar } = router.switchAny<{ content: string; sidebar: string }>(
        //     {
        //         "/": () => {
        //             this.#eventListComponent.loadEvents();
        //             return {
        //                 content: this.#eventListComponent.render(),
        //                 sidebar: createEventBtn() + this.#calendarComponent.render() + this.#tagsComponent.render(),
        //             };
        //         },
        //         "/profile": () => {
        //             if (router.isUrlChanged()) {
        //                 this.#profileComponent.loadProfile();
        //                 requestManager.request(loadEvents);
        //             }
        //             return {
        //                 content:
        //                     this.#profileComponent.render() +
        //                     DelimiterTemplate({ content: "Предстоящие мероприятия" }) +
        //                     this.#eventListComponent.render(),
        //                 sidebar:
        //                     this.#friendListCardComponent.render() +
        //                     createEventBtn() +
        //                     this.#calendarComponent.render() +
        //                     this.#tagsComponent.render(),
        //             };
        //         },
        //         "/events": () => {
        //             this.#eventComponent.loadEvent();
        //             return {
        //                 content: this.#eventComponent.render(),
        //                 sidebar: createEventBtn() + this.#calendarComponent.render() + this.#tagsComponent.render(),
        //             };
        //         },
        //         "/createevent": () => {
        //             this.#eventProcessingComponent.setCreate();
        //             return {
        //                 content: this.#eventProcessingComponent.render(),
        //                 sidebar: this.#calendarComponent.render() + this.#tagsComponent.render(),
        //             };
        //         },
        //         "/editevent": () => {
        //             this.#eventProcessingComponent.setEdit();
        //             return {
        //                 content: this.#eventProcessingComponent.render(),
        //                 sidebar: this.#calendarComponent.render() + this.#tagsComponent.render(),
        //             };
        //         },
        //     },
        //     () => ({
        //         content: "404",
        //         sidebar: this.#calendarComponent.render() + this.#tagsComponent.render(),
        //     })
        // );

        // if (store.getState().modalWindow.name !== ModalWindowName.NONE) {
        //     switch (store.getState().modalWindow.name) {
        //         case ModalWindowName.LOGIN:
        //             this.#modalWindowComponent.content = this.#loginComponent.render();
        //             break;
        //         case ModalWindowName.REGISTER:
        //             this.#modalWindowComponent.content = this.#registerComponent.render();
        //             break;
        //         case ModalWindowName.FRIENDLIST:
        //             this.#modalWindowComponent.content = this.#friendListComponent.render();
        //             break;
        //     }

        //     modalWindow = this.#modalWindowComponent.render();
        // }

        // const template = AppTemplate({
        //     header: this.#headerComponent.render(),
        //     content: content,
        //     footer: "Footer",
        //     modalWindow: modalWindow,
        //     sidebar: sidebar,
        // });
    }
}
