/** @module Components */

import { Component } from "components/Component";
import { Header } from "components/Header/Header";
import { EventList } from "components/Events/EventList/EventList";
import { ModalWindow } from "components/ModalWindow/ModalWindow";
import { Login } from "components/Auth/Login/Login";
import { Registration } from "components/Auth/Registration/Registration";

import { Calendar } from "./Calendar/Calendar";

import { FriendListCard } from "components/Auth/Profile/FriendList/FriendListCard";
import { FriendList} from "components/Auth/Profile/FriendList/FriendList"

import AppTemplate from "templates/App.handlebars";
import DelimiterTemplate from "templates/Common/Delimiter.handlebars";
import CreateEventBtn from "templates/Common/CreateEventBtn.handlebars";

import { addRouterEvents, removeRouterEvents, router } from "modules/router";
import { Profile } from "./Auth/Profile/Profile";
import { svgInliner } from "modules/svgLoader";

import { store } from "flux";
import { ModalWindowName } from "flux/slices/modalWindowSlice";
import { isAuthorized } from "flux/slices/userSlice";
import { EventPage } from "./Events/EventPage/EventPage";
import { EventProcessing } from "./Events/EventProcessing/EventProcessing";

import { loadEvents } from "requests/events";
import { loadAuthorization, loadFriends } from "requests/user";
import { loadTags } from "requests/tags";
import { SidebarTags } from "./Tags/SidebarTags";
import { requestManager } from "requests/index";

/**
 * @classdesc Main app component
 * @class
 * @extends Component
 */
export class App extends Component {
    #headerComponent: Header;
    #eventListComponent: EventList;
    #modalWindowComponent: ModalWindow;
    #friendListComponent: FriendList;
    #friendListCardComponent: FriendListCard;
    // #subscriptionListComponent: SubscriptionList;
    #calendarComponent: Calendar;
    #tagsComponent: SidebarTags;
    #loginComponent: Login;
    #registerComponent: Registration;
    #profileComponent: Profile;
    #eventComponent: EventPage;
    #eventProcessingComponent: EventProcessing;

    constructor(parent: HTMLElement) {
        super(parent);

        requestManager.request(loadAuthorization);
        requestManager.request(loadTags);

        this.#headerComponent = this.createComponent(Header);
        this.#eventListComponent = this.createComponent<EventList>(EventList);
        this.#modalWindowComponent = this.createComponent(ModalWindow);
        this.#eventComponent = this.createComponent(EventPage);
        this.#eventProcessingComponent = this.createComponent(EventProcessing);

        this.#loginComponent = this.createComponent(Login);
        this.#registerComponent = this.createComponent(Registration);

        this.#friendListComponent = this.createComponent(FriendList);
        this.#friendListCardComponent = this.createComponent(FriendListCard);
        // this.#subscriptionListComponent = this.createComponent(SubscriptionList);

        this.#calendarComponent = this.createComponent(Calendar);
        this.#tagsComponent = this.createComponent(SidebarTags);

        this.#profileComponent = this.createComponent(Profile);
    }

    rerender() {
        removeRouterEvents();
        this.removeChildEvents();
        if (this.parent instanceof HTMLElement) {
            this.parent.innerHTML = this.render();
        }
        this.addChildEvents();
        svgInliner.applyRules();
        addRouterEvents();
    }

    render() {
        let modalWindow = "";
        router.reset();

        if (store.getState().modalWindow.name !== ModalWindowName.NONE) {
            switch (store.getState().modalWindow.name) {
                case ModalWindowName.LOGIN:
                    this.#modalWindowComponent.content = this.#loginComponent.render();
                    break;
                case ModalWindowName.REGISTER:
                    this.#modalWindowComponent.content = this.#registerComponent.render();
                    break;
                case ModalWindowName.FRIENDLIST:
                    this.#modalWindowComponent.content = this.#friendListComponent.render();
                    break;
            }

            modalWindow = this.#modalWindowComponent.render();
        }

        const createEventBtn = () => {
            return isAuthorized(store.getState().user) ? CreateEventBtn() : "";
        };

        const { content, sidebar } = router.switchAny<{ content: string; sidebar: string }>(
            {
                "/": () => {
                    this.#eventListComponent.loadEvents();
                    return {
                        content: this.#eventListComponent.render(),
                        sidebar: createEventBtn() + this.#calendarComponent.render() + this.#tagsComponent.render(),
                    };
                },
                "/profile": () => {
                    if (router.isUrlChanged()) {
                        this.#profileComponent.loadProfile();
                        requestManager.request(loadEvents);
                    }
                    return {
                        content:
                            this.#profileComponent.render() +
                            DelimiterTemplate({ content: "Предстоящие мероприятия" }) +
                            this.#eventListComponent.render(),
                        sidebar:
                            this.#friendListCardComponent.render() +
                            createEventBtn() +
                            this.#calendarComponent.render() +
                            this.#tagsComponent.render(),
                    };
                },
                "/events": () => {
                    this.#eventComponent.loadEvent();
                    return {
                        content: this.#eventComponent.render(),
                        sidebar: createEventBtn() + this.#calendarComponent.render() + this.#tagsComponent.render(),
                    };
                },
                "/createevent": () => {
                    this.#eventProcessingComponent.setCreate();
                    return {
                        content: this.#eventProcessingComponent.render(),
                        sidebar: this.#calendarComponent.render() + this.#tagsComponent.render(),
                    };
                },
                "/editevent": () => {
                    this.#eventProcessingComponent.setEdit();
                    return {
                        content: this.#eventProcessingComponent.render(),
                        sidebar: this.#calendarComponent.render() + this.#tagsComponent.render(),
                    };
                },
            },
            () => ({
                content: "404",
                sidebar: this.#calendarComponent.render() + this.#tagsComponent.render(),
            })
        );

        const template = AppTemplate({
            header: this.#headerComponent.render(),
            content: content,
            footer: "Footer",
            modalWindow: modalWindow,
            sidebar: sidebar,
        });
        return template;
    }
}
