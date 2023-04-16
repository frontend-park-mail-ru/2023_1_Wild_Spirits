import { ajax } from "modules/ajax";
import { ResponseBody } from "responses/ResponseBase";

import { store } from "flux";
import { selectCity, setCities } from "flux/slices/headerSlice";
import { setCategories } from "flux/slices/headerSlice";
import { LoadStatus } from "./LoadStatus";
import { requestManager } from "./requestManager";

export const loadCities = () =>
    ajax
        .get<ResponseBody<{ cities: { id: number; name: string }[] }>>({
            url: "/cities",
        })
        .then(({ json, response }) => {
            if (response.ok) {
                store.dispatch(setCities({ cities: json.body.cities }));

                requestManager.resolveRequest('loadCities')
            }
        })
        .catch((error) => {
            console.log("catch:", error);
            store.dispatch(setCities({ cities: ["Москва", "Санкт-Петербург", "Нижний Новгород"] }));
        });

export const loadCategories = () =>
    ajax
        .get<ResponseBody<{ categories: { id: number; name: string }[] }>>({
            url: "/categories",
        })
        .then(({ json, response }) => {
            if (response.ok) {
                store.dispatch(setCategories({ categories: json.body.categories }));
            }
        })
        .catch((error) => {
            console.log("catch:", error);
            store.dispatch(setCategories({ categories: ["Концерты", "Театр", "Кино", "Фестивали", "Выставки"] }));
        });
