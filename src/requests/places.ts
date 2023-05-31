import { ResponseBody } from "responses/ResponseBase";
import { TRequestResolver } from "./requestTypes";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { store } from "flux";
import { setPlaces, setPlacesLoadError } from "flux/slices/placesSlice";
import { TEventPlace } from "models/Events";

export const findEventPlaces = (resolveRequest: TRequestResolver) => {
    const name = store.state.places.name || "";
    const address = store.state.places.address || "";
    ajax.get<ResponseBody<{ places: TEventPlace[] }>>({
        url: "/places",
        urlProps: { page_size: "5", name: name.trim(), address: address.trim() },
    })
        .then(({ json, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(setPlaces(json.body.places));
            }
            resolveRequest();
        })
        .catch(() => {
            store.dispatch(setPlacesLoadError());
            resolveRequest();
        });
};

export const loadPlaces = (resolveRequest: TRequestResolver) => {
    ajax.get<ResponseBody<{ places: TEventPlace[] }>>({
        url: "/places",
        urlProps: { page_size: "5" },
    })
        .then(({ json, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(setPlaces(json.body.places));
            }
            resolveRequest();
        })
        .catch(() => {
            store.dispatch(setPlacesLoadError());
            resolveRequest();
        });
};
