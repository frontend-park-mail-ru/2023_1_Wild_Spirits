import { Store } from "./store";
import { Slice } from "./slice";

import userSlice from "./slices/userSlice";
import modalWindowSlice from "./slices/modalWindowSlice";
import headerSlice from "./slices/headerSlice";
import tagsSlice from "./slices/tagsSlice";
import calendarSlice from "./slices/calendarSlice";
import eventsSlice from "./slices/eventSlice";
import friendsListSlice from "./slices/friendsListSlice";
import placesSlice from "./slices/placesSlice";
import metaSlice from "./slices/metaSlice";
import sideMenuSlice from "./slices/sideMenuSlice";

export type SlicesMapObject<S = any> = {
    [K in keyof S]: Slice<S[K]>;
};

const configureStore = <S>(slices: SlicesMapObject<S>): Store<S> => {
    return new Store(
        Object.fromEntries(
            Object.entries(slices).map(([key, value]) => {
                return [key, (value as Slice<any>).state];
            })
        ) as S,
        Object.fromEntries(
            Object.entries(slices).map(([key, value]) => {
                return [key, (value as Slice<any>).reducer];
            })
        )
    );
};

export let store = configureStore({
    meta: metaSlice,
    user: userSlice,
    modalWindow: modalWindowSlice,
    header: headerSlice,
    tags: tagsSlice,
    places: placesSlice,
    calendar: calendarSlice,
    events: eventsSlice,
    friendList: friendsListSlice,
    sideMenu: sideMenuSlice
});
