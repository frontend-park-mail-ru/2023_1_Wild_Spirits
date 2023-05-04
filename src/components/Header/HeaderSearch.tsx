import {VDOM, Component} from "modules/vdom";

import { store } from "flux";
import { setSearchQuery } from "flux/slices/headerSlice";
import { requestManager } from "requests";
import { loadEvents } from "requests/events";
import { closeMobileSearch } from "flux/slices/metaSlice";

export class HeaderSearch extends Component {
    didMount(): void {
        const search = document.getElementById("event-search");
        search?.focus();
    }

    #search = (event: Event) => {
        const searchInput = event.target as HTMLInputElement;

        if (!searchInput) {
            return;
        }

        store.dispatch(setSearchQuery(searchInput.value));
        requestManager.request(loadEvents);
    };

    #onFocusOut= () => {
        if (store.state.meta.mobileSearch) {
            store.dispatch(closeMobileSearch());
        }
    }

    render() {
        return (
            <div className="header__search-container">
                <input
                    id="event-search"
                    type="text"
                    size={1}
                    onChange={(e) => this.#search(e as unknown as Event)}
                    placeholder="Поиск"
                    value={store.state.header.searchQuery}
                    className="search"
                    onBlur={() => this.#onFocusOut()}
                />
            </div>
        )
    }
}