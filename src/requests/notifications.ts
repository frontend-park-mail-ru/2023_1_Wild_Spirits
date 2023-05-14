import { store } from "flux";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { TRequestResolver } from "./requestTypes";
import config from "config";
import { setInvites, setInvitesLoadError } from "flux/slices/notificationSlice";

export const loadInvites = (resolveRequest: TRequestResolver) => {
    ajax.get({
        url: "/invites",
        credentials: true,
    })
        .then(({ json, status }) => {
            console.log(status, json);
            if (status === AjaxResultStatus.SUCCESS) {
                console.error("/invites", json);
                store.dispatch(setInvites([]));
            } else {
                console.error("/invites Error", json);
                store.dispatch(setInvitesLoadError());
            }
            resolveRequest();
        })
        .catch((ERROR) => {
            console.error("/invites ERROR", ERROR);
            store.dispatch(setInvitesLoadError());
            resolveRequest();
        });
};

export const createWebSocket = (resolveRequest: TRequestResolver) => {
    setTimeout(() => {
        console.log(ajax.getHeaders("x-csrf-token"));
        console.log("?x-csrf-token=" + encodeURIComponent(ajax.getHeaders("x-csrf-token") || ""));
        console.log(encodeURI(`?x-csrf-token=${encodeURIComponent(ajax.getHeaders("x-csrf-token") || "")}`));

        const ws = new WebSocket(
            config.WEBSOCKET + `?x-csrf-token=${encodeURIComponent(ajax.getHeaders("x-csrf-token") || "")}`
        );
        ws.addEventListener("open", () => {
            console.log("OPENED");
        });

        ws.addEventListener("message", ({ data }) => {
            console.log("MESSAGE", data);
        });

        resolveRequest();
    }, 2000);
};
