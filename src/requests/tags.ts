import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseBody } from "responses/ResponseBase";

import { store } from "flux/index";
import { setTags } from "flux/slices/tagsSlice";
import { TRequest } from "./requestTypes";
import { TTag } from "models/Tag";

export const loadTags: TRequest = (resolveRequest) =>
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
        .catch((error) => {
            console.log(error);
        });
