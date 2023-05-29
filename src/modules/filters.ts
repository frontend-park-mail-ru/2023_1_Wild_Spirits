import { store } from "flux";
import { clearFinishDate, clearStartDate } from "flux/slices/calendarSlice";
import { resetEventsCards, setEventsCardsLoadStart } from "flux/slices/eventSlice";
import { clearCategory, clearSearchQuery } from "flux/slices/headerSlice";
import { clearTags } from "flux/slices/tagsSlice";

export const clearFilters = () => {
    store.dispatch(
        clearCategory(),
        clearSearchQuery(),
        clearTags(),
        clearStartDate(),
        clearFinishDate(),
        resetEventsCards(),
        setEventsCardsLoadStart()
    );
};
