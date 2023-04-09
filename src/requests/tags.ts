import { ajax } from "modules/ajax";
import { ResponseBody } from "responses/ResponseBase"

import { store } from "flux/index";
import { setTags } from "flux/slices/tagsSlice";

export const loadTags = () => {
    ajax.get<ResponseBody<{tags: {id: number, name: string}[]}>>({
        url: "/tags",
        credentials: false
    }).then(({json, response}) => {
        if (response.ok && json.body) {
            store.dispatch(setTags({tags: json.body.tags}));
        }
    }).catch(error => {
        console.log(error)
    })
}
