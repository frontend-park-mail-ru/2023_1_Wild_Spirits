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
    ajax.post({
        url: `/events/${eventId}/invite`,
        urlProps: { invitedId: userId.toString() },
        credentials: true,
    })
        .then(({ status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                // store.dispatch(setInvites([]));
            } else {
                // store.dispatch(setInvitesLoadError());
            }
            resolveRequest();
        })
        .catch(() => {
            // store.dispatch(setInvitesLoadError());
            resolveRequest();
        });
};

export const acceptInvitation = (resolveRequest: TRequestResolver, authorId: number, eventId: number) => {
    ajax.post({
        url: `/invites/accept`,
        urlProps: { authorId: authorId.toString(), eventId: eventId.toString() },
        credentials: true,
    })
        .then(({ status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(removeInvite({ userId: authorId, eventId: eventId }), feature({ eventId }));
            }
            resolveRequest();
        })
        .catch(() => {
            resolveRequest();
        });
};

export const declineInvitation = (resolveRequest: TRequestResolver, authorId: number, eventId: number) => {
    ajax.post({
        url: `/invites/decline`,
        urlProps: { authorId: authorId.toString(), eventId: eventId.toString() },
        credentials: true,
    })
        .then(({ status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(removeInvite({ userId: authorId, eventId: eventId }));
            }
            resolveRequest();
        })
        .catch(() => {
            resolveRequest();
        });
};

export const createWebSocket = (resolveRequest: TRequestResolver) => {
    console.log('create websocket')
    setTimeout(() => {
        console.log('websocket created')
        const ws = new WebSocket(
            config.WEBSOCKET + `?x-csrf-token=${encodeURIComponent(ajax.getHeaders("x-csrf-token") || "")}`
        );
        // ws.addEventListener("open", () => {
        // });

        ws.addEventListener('close', ()=>{
            console.log('on close')
            createWebSocket(resolveRequest);

        });

        ws.addEventListener("message", ({ data }) => {
            const result = JSON.parse(data) as WSResponseInvite;
            store.dispatch(addInvite(result.body.invite));
        });

        resolveRequest();
    }, 2000);
};
