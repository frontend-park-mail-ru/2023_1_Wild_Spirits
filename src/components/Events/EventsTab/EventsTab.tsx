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
        this.setState({ selectedTab: type });
    };

    render() {
        const { selectedTab } = this.state;
        const { orgEvents, subbedEvents, likedEvents, plannedEvents } = store.state.events;
        const cardClassName = "col-m-12 col-l-6 col-xxl-4 col-3";

        const items: { [key in ProfileEventsTab.Type]: string } = {
            [ProfileEventsTab.ORG]: "От этого организатора",
            [ProfileEventsTab.OTHER]: "Мероприятия подписок",
            [ProfileEventsTab.LIKE]: "Понравившиеся",
            [ProfileEventsTab.SAVED]: "Запланированные",
        };

        return (
            <div className="tab content">
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
                    {selectedTab === ProfileEventsTab.ORG && (
                        <EventList events={orgEvents} cardClassName={cardClassName} />
                    )}
                    {selectedTab === ProfileEventsTab.OTHER && (
                        <EventList events={subbedEvents} cardClassName={cardClassName} />
                    )}
                    {selectedTab === ProfileEventsTab.LIKE && (
                        <EventList events={likedEvents} cardClassName={cardClassName} />
                    )}
                    {selectedTab === ProfileEventsTab.SAVED && (
                        <EventList events={plannedEvents} cardClassName={cardClassName} />
                    )}
                </div>
            </div>
        );
    }
}
