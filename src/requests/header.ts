import { ajax } from "modules/ajax";
import { ResponseBody } from "responses/ResponseBase";

import { store } from "flux";
import { selectCity, setCities } from "flux/slices/headerSlice";
import { setCategories } from "flux/slices/headerSlice";
import { TRequest } from "./requestTypes";

export const loadCities: TRequest = (resolveRequest) =>
    ajax
        .get<ResponseBody<{ cities: { id: number; name: string }[] }>>({
            url: "/cities",
        })
        .then(({ json, response }) => {
            if (response.ok) {
                store.dispatch(
                    setCities({ cities: json.body.cities }),
                    selectCity({ city: store.getState().user.data?.city_name })
                );

                // requestManager.resolveRequest('loadCities')
            }
            resolveRequest();
        })
        .catch((error) => {
            console.log("catch:", error);
            // store.dispatch(setCities({ cities: ["Москва", "Санкт-Петербург", "Нижний Новгород"] }));
        });

export const loadCategories: TRequest = (resolveRequest) =>
    ajax
        .get<ResponseBody<{ categories: { id: number; name: string }[] }>>({
            url: "/categories",
        })
        .then(({ json, response }) => {
            if (response.ok) {
                store.dispatch(setCategories({ categories: json.body.categories }));
            }
            resolveRequest();
        })
        .catch((error) => {
            console.log("catch:", error);
            // store.dispatch(setCategories({ categories: ["Концерты", "Театр", "Кино", "Фестивали", "Выставки"] }));
        });
