import { VDOM } from "modules/vdom";
import { ProfileEventsTab } from "./EventsTab";

export interface EventsTabsItemProps {
    title: string;
    selectedType: ProfileEventsTab.Type;
    thisType: ProfileEventsTab.Type;
    // TODO is first ???
    handleChangeTab: (type: ProfileEventsTab.Type) => void;
}

export const EventsTabsItem = ({ title, selectedType, thisType, handleChangeTab }: EventsTabsItemProps) => {
    return (
        <div
            className={`tab__item ${selectedType === thisType ? "checked" : ""}`}
            onClick={() => handleChangeTab(thisType)}
        >
            {title}
        </div>
    );
};
