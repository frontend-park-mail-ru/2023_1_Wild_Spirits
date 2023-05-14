import { VDOM } from "modules/vdom";
import { store } from "flux";
import { getSelectedCityName } from "flux/slices/headerSlice";
import { openCitySelector } from "flux/slices/modalWindowSlice";

export const CityPickerButton = () => {
    const selectedCityName = getSelectedCityName(store.state.header);
    return (
        <div className="header__city-selector">
            <button className="header__city-selector__button" onClick={() => store.dispatch(openCitySelector())}>
                <img src="/assets/img/geo-icon.svg"></img>
                <span>{selectedCityName}</span>
            </button>
        </div>
    );
};
