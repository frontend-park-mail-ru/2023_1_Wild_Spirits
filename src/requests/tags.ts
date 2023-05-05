import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseBody } from "responses/ResponseBase";

import { store } from "flux/index";
import { setTags } from "flux/slices/tagsSlice";
import { TRequestResolver } from "./requestTypes";
import { TTag } from "models/Tag";

export const loadTags = (resolveRequest: TRequestResolver) =>
    ajax
        .get<ResponseBody<{ tags: TTag[] }>>({
            url: "/tags",
            credentials: false,
        })
        .then(({ json, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(setTags({ tags: json.body.tags }));
            }
            resolveRequest();
        })
        .catch(() => {
            resolveRequest();
        });
