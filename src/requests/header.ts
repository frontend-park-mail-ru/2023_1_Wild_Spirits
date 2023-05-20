import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseBody } from "responses/ResponseBase";

import { store } from "flux";
import { selectCity, setCities } from "flux/slices/headerSlice";
import { setCategories } from "flux/slices/headerSlice";
import { TRequestResolver } from "./requestTypes";
import { TCategory } from "models/Category";
import { getAuthorizedCity } from "flux/slices/userSlice";

export const loadCities = (resolveRequest: TRequestResolver) => {
    ajax.get<ResponseBody<{ cities: { id: number; name: string }[] }>>({
        url: "/cities",
    })
        .then(({ json, response }) => {
            if (response.ok) {
                store.dispatch(
                    setCities({ cities: json.body.cities }),
                    selectCity({ city: getAuthorizedCity(store.state.user) })
                );
            }
            resolveRequest();
        })
        .catch(() => {
            resolveRequest();
        });
};

export const loadCategories = (resolveRequest: TRequestResolver) => {
    ajax.get<ResponseBody<{ categories: TCategory[] }>>({
        url: "/categories",
    })
        .then(({ json, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(setCategories(json.body.categories));
            }
            resolveRequest();
        })
        .catch(() => {
            resolveRequest();
        });
};
