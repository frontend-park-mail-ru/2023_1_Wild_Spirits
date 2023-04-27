import { ResponseBody } from "responses/ResponseBase";
import { TRequestResolver } from "./requestTypes";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { store } from "flux";
import { setPlaces, setPlacesLoadError } from "flux/slices/placesSlice";
import { TEventPlace } from "models/Events";

export const loadPlaces = (resolveRequest: TRequestResolver) => {
    ajax.get<ResponseBody<{ places: TEventPlace[] }>>({
        url: "/places",
    })
        .then(({ json, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(setPlaces(json.body.places));
            }
            resolveRequest();
        })
        .catch((error) => {
            store.dispatch(setPlacesLoadError());
            resolveRequest();
        });
};
