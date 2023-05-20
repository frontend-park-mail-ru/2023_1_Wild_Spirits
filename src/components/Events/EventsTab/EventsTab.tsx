import { VDOM, Component } from "modules/vdom";
import { EventsTabsItem } from "./EventsTabsItem";
import { EventList } from "../EventList/EventList";
import { store } from "flux";

export namespace ProfileEventsTab {
    // TODO export const FIRST = "FIRST"; ???

    export const ORG = "ORG";
    export const OTHER = "OTHER";
    export const LIKE = "LIKE";
    export const SAVED = "SAVED";

    export type Type = typeof ORG | typeof OTHER | typeof LIKE | typeof SAVED;
}

interface EventsTabState {
    // TODO availableTabs ???
    selectedTab: ProfileEventsTab.Type;
}

export class EventsTab extends Component<any, EventsTabState> {
    constructor() {
        super({});

        this.state = { selectedTab: ProfileEventsTab.ORG };

        this.handleChangeTab = this.handleChangeTab.bind(this);
    }

    handleChangeTab = (type: ProfileEventsTab.Type) => {
        console.log(type);
        this.setState({ selectedTab: type });
    };

    render() {
        const { selectedTab } = this.state;

        const items: { [key in ProfileEventsTab.Type]: string } = {
            [ProfileEventsTab.ORG]: "От этого организатора",
            [ProfileEventsTab.OTHER]: "Мероприятия подписок",
            [ProfileEventsTab.LIKE]: "Запланированные",
            [ProfileEventsTab.SAVED]: "Понравившиеся",
        };

        return (
            <div className="tab">
                <form className="tab__container">
                    <div className="tab__wrap">
                        {Object.entries(items).map(([type, title]) => (
                            <EventsTabsItem
                                title={title}
                                thisType={type as ProfileEventsTab.Type}
                                selectedType={selectedTab}
                                handleChangeTab={this.handleChangeTab}
                            />
                        ))}
                    </div>
                </form>
                <div className="tab__content">
                    {selectedTab === ProfileEventsTab.ORG && <EventList events={store.state.events.orgEvents} />}
                    {selectedTab === ProfileEventsTab.OTHER && <EventList events={store.state.events.subbedEvents} />}
                    {selectedTab === ProfileEventsTab.LIKE && <EventList events={store.state.events.likedEvents} />}
                    {selectedTab === ProfileEventsTab.SAVED && <EventList events={store.state.events.plannedEvents} />}
                </div>
            </div>
        );
    }
}
