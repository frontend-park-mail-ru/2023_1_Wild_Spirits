import { VDOM, Component } from "modules/vdom";

import { store } from "flux";

import { selectCity } from "flux/slices/headerSlice";
import { closeModal } from "flux/slices/modalWindowSlice";

import { requestManager } from "requests";
import { loadEvents } from "requests/events";

export class CityPicker extends Component<any, { query: string }> {
    constructor() {
        super({});

        this.state = { query: "" };
    }

    #search = (event: Event) => {
        const searchInput = event.target as HTMLInputElement;

        if (!searchInput) {
            return;
        }

        this.setState({ query: searchInput.value });
    };

    render(): JSX.Element {
        const cities = store.state.header.cities
            .map((city) => city.name)
            .filter((city) => city.includes(this.state.query));

        return (
            <div className="city-picker">
                <div className="city-picker__header">
                    <h2 className="city-picker__header__title">Выберите город</h2>

                    <input
                        className="search"
                        value={this.state.query}
                        onInput={(e) => this.#search(e as unknown as Event)}
                    ></input>
                </div>

                <div className="city-picker__content">
                    {cities.map((city) => (
                        <button
                            onClick={() => {
                                store.dispatch(selectCity({ city: city }), closeModal());
                                requestManager.request(loadEvents);
                            }}
                            className="city-picker__item"
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
}
