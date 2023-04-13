import { ajax } from "modules/ajax";
import { ResponseBodyOrError } from "responses/ResponseBase";

import { store } from "flux";
import { setCities } from "flux/slices/headerSlice";
import { setCategories } from "flux/slices/headerSlice";

export const loadCities = () =>
    ajax
        .get<ResponseBodyOrError<{ cities: { id: number; name: string }[] }>>({
            url: "/cities",
            credentials: false,
        })
        .then(({ json, response }) => {
            if (response.ok) {
                store.dispatch(setCities({ cities: json.body!.cities }));
            }
        })
        .catch((error) => {
            console.log("catch:", error);
            store.dispatch(setCities({ cities: ["Москва", "Санкт-Петербург", "Нижний Новгород"] }));
        });

export const loadCategories = () =>
    ajax
        .get<ResponseBodyOrError<{ categories: { id: number; name: string }[] }>>({
            url: "/categories",
            credentials: false,
        })
        .then(({ json, response }) => {
            if (response.ok) {
                store.dispatch(setCategories({ categories: json.body!.categories }));
            }
        })
        .catch((error) => {
            console.log("catch:", error);
            store.dispatch(setCategories({ categories: ["Концерты", "Театр", "Кино", "Фестивали", "Выставки"] }));
        });
