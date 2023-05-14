import { store } from "flux";
import { AjaxResultStatus, UrlPropsType, ajax } from "modules/ajax";
import { TRequestResolver } from "./requestTypes";
import config from "config";

export const loadInvites = (resolveRequest: TRequestResolver) => {
    ajax.get({
        url: "/invites",
        credentials: true,
    })
        .then(({ json, status }) => {
            console.log(status, json);
            // if (status === AjaxResultStatus.SUCCESS) {
            // } else {
            // }
            resolveRequest();
        })
        .catch((error) => {
            console.log(error);
            resolveRequest();
        });
};

export const createWebSocket = (resolveRequest: TRequestResolver) => {
    setTimeout(() => {
        const ws = new WebSocket(config.WEBSOCKET);
        ws.addEventListener("open", () => {
            console.log("OPENED");
        });

        ws.addEventListener("message", ({ data }) => {
            console.log("MESSAGE", data);
        });

        resolveRequest();
    }, 2000);
};
