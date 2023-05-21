import { store } from "flux";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { TRequestResolver } from "./requestTypes";
import config from "@config";
import { addInvite, removeInvite, setInvites, setInvitesLoadError } from "flux/slices/notificationSlice";
import { ResponseInvites, WSResponseInvite } from "responses/ResponseInvites";
import { featureEvent as feature } from "flux/slices/eventSlice";

export const loadInvites = (resolveRequest: TRequestResolver) => {
    ajax.get<ResponseInvites>({
        url: "/invites",
        credentials: true,
    })
        .then(({ json, status }) => {
            console.log(status, json);
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(setInvites(json.body.invites));
            } else {
                store.dispatch(setInvitesLoadError());
            }
            resolveRequest();
        })
        .catch(() => {
            store.dispatch(setInvitesLoadError());
            resolveRequest();
        });
};

export const inviteUserToEvent = (resolveRequest: TRequestResolver, userId: number, eventId: number) => {
    console.log("inviteUserToEvent start");
    ajax.post({
        url: `/events/${eventId}/invite`,
        urlProps: { invitedId: userId.toString() },
        credentials: true,
    })
        .then(({ json, status }) => {
            console.log(status, json);
            if (status === AjaxResultStatus.SUCCESS) {
                // store.dispatch(setInvites([]));
            } else {
                // store.dispatch(setInvitesLoadError());
            }
            resolveRequest();
        })
        .catch((error) => {
            console.log("ERROR", error);
            // store.dispatch(setInvitesLoadError());
            resolveRequest();
        });
};

export const acceptInvitation = (resolveRequest: TRequestResolver, authorId: number, eventId: number) => {
    ajax.post({
        url: `/invites/accept`,
        urlProps: {authorId: authorId.toString(), eventId: eventId.toString()},
        credentials: true
    })
        .then(({ json, status}) => {
            console.log(status, json);
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(removeInvite({userId: authorId, eventId: eventId}), feature({eventId}));
            }
            resolveRequest();
        })
        .catch  ((error) => {
            console.log("ERROR", error);
            resolveRequest();
        });
};

export const declineInvitation = (resolveRequest: TRequestResolver, authorId: number, eventId: number) => {
    ajax.post({
        url: `/invites/decline`,
        urlProps: {authorId: authorId.toString(), eventId: eventId.toString()},
        credentials: true
    })
        .then(({ json, status}) => {
            console.log(status, json);
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(removeInvite({userId: authorId, eventId: eventId}));
            }
            resolveRequest();
        })
        .catch  ((error) => {
            console.log("ERROR", error);
            resolveRequest();
        });
};

export const createWebSocket = (resolveRequest: TRequestResolver) => {
    setTimeout(() => {
        const ws = new WebSocket(
            config.WEBSOCKET + `?x-csrf-token=${encodeURIComponent(ajax.getHeaders("x-csrf-token") || "")}`
        );
        ws.addEventListener("open", () => {
            console.log("OPENED");
        });

        ws.addEventListener("message", ({ data }) => {
            console.log("MESSAGE", JSON.parse(data));
            const result = JSON.parse(data) as WSResponseInvite;
            store.dispatch(addInvite(result.body.invite));
        });

        resolveRequest();
    }, 2000);
};
