import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseUserLight, ResponseUserProfile } from "responses/ResponsesUser";
import { ResponseBody, ResponseErrorDefault } from "responses/ResponseBase";

import { store } from "flux";
import {
    setData,
    logout,
    setCurrentProfile,
    setCurrentProfileFriends,
    authorizedLoadStart,
    authorizedLoadError,
} from "flux/slices/userSlice";
import { close } from "flux/slices/modalWindowSlice";
import { TRequest, TRequestResolver } from "./requestTypes";

export const loadAuthorization: TRequest = (resolveRequest) => {
    store.dispatch(authorizedLoadStart());
    return ajax.get<ResponseUserLight, ResponseErrorDefault>({
        url: "/authorized",
        credentials: true,
    })
        .then(({ json, response, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                const csrf = response.headers.get("x-csrf-token");
                if (csrf) {
                    ajax.addHeaders({ "x-csrf-token": csrf });
                }

                store.dispatch(setData(json.body.user), close());
            } else {
                store.dispatch(setData(undefined));
            }
            resolveRequest();
        })
        .catch((error) => {
            store.dispatch(authorizedLoadError());
        });
};

export const loadProfile: TRequest = (resolveRequest, id: number) => {
    return ajax.get<ResponseUserProfile>({
        url: `/users/${id}`,
        credentials: true,
    })
        .then(({ json, response }) => {
            if (response.ok && json.body) {
                store.dispatch(setCurrentProfile({ profile: json.body, id: id }));
            }
            resolveRequest();
        })
        .catch((error) => {
            console.log("catch:", error);
        });
};

export const loadFriends: TRequest = (resolveRequest, user_id: number) => 
    ajax.get<ResponseBody<{ users: { id: number; name: string; img: string }[] }>>({
        url: `/users/${user_id}/friends`,
    }).then(({ json, response, status }) => {
        if (status === AjaxResultStatus.SUCCESS) {
            store.dispatch(setCurrentProfileFriends({ friends: json.body.users }));
        }
        resolveRequest();
    });

export const addFriend: TRequest = (resolveRequest, user_id: number) =>
    ajax.post({
        url: `/friends/${user_id}`,
        credentials: true,
    }).then(({ status }) => {
        if (status === AjaxResultStatus.SUCCESS) {
            // TODO do something?
        }
        resolveRequest();
    });

type TWarningMsgCallack = (warning: string | undefined) => void;

export const loginUser: TRequest = (resolveRequest, 
                                    formData: FormData,
                                    warningMsg: TWarningMsgCallack) => {
    return ajax.post<ResponseUserLight, ResponseErrorDefault>({
        url: "/login",
        credentials: true,
        body: { email: formData.get("email"), pass: formData.get("password") },
    })
        .then(({ json, response, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                const csrf = response.headers.get("x-csrf-token");
                if (csrf) {
                    ajax.addHeaders({ "x-csrf-token": csrf });
                    store.dispatch(setData(json.body.user), close());
                }
            } else {
                warningMsg(json.errorMsg);
            }
            resolveRequest();
        })
        .catch((error) => {
            console.log("catch:", error);
        });
}

export const registerUser: TRequest = (resolveRequest, 
                                       formData: FormData, 
                                       warningMsg: TWarningMsgCallack) =>
    ajax.post<ResponseUserLight, ResponseErrorDefault>({
        url: "/register",
        credentials: true,
        body: {
            email: formData.get("email"),
            pass: formData.get("password"),
            username: formData.get("nickname"),
        },
    })
        .then(({ json, response, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                const csrf = response.headers.get("x-csrf-token");
                if (csrf) {
                    ajax.addHeaders({ "x-csrf-token": csrf });
                }
                store.dispatch(setData(json.body.user), close());
            } else {
                warningMsg(json.errorMsg);
            }
            resolveRequest();
        })
        .catch((error) => {
            console.log("catch:", error);
        });

export const logoutUser: TRequest = (resolveRequest) =>
    ajax.post({
        url: "/logout",
        credentials: true,
    })
        .then(({ status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                ajax.removeHeaders("x-csrf-token");
                store.dispatch(logout());
            }
            resolveRequest();
        })
        .catch((error) => {
            console.log("catch:", error);
        });
