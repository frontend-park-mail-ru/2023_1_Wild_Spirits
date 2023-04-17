import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseUserLight, ResponseUserProfile } from "responses/ResponsesUser";
import { ResponseBody, ResponseErrorDefault } from "responses/ResponseBase";

import { store } from "flux";
import {
    setData,
    logout,
    setCurrentProfile,
    authorizedLoadStart,
    authorizedLoadError,
} from "flux/slices/userSlice";
import { setFriends } from "flux/slices/friendsListSlice";
import { close } from "flux/slices/modalWindowSlice";
import { TRequest } from "./requestTypes";

export const loadAuthorization: TRequest = (resolveRequest) => {
    store.dispatch(authorizedLoadStart());
    ajax.get<ResponseUserLight, ResponseErrorDefault>({
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
    ajax.get<ResponseUserProfile>({
        url: `/users/${id}`,
        credentials: true,
    })
        .then(({ json, response }) => {
            if (response.ok && json.body) {
                store.dispatch(setCurrentProfile({ profile: json.body, id: id }));
            }
            resolveRequest(id);
        })
        .catch((error) => {
            console.log("catch:", error);
        });
};

export const loadFriends: TRequest = (resolveRequest, user_id: number, search?: string) => {
    let urlProps = {}
    if (search !== undefined && search.length > 0) {
        urlProps = {
            name: search
        }
    }
    ajax.get<ResponseBody<{ users: { id: number; name: string; img: string }[] }>>({
        url: `/users/${user_id}/friends`,
        urlProps: urlProps
    }).then(({ json, response, status }) => {
        if (status === AjaxResultStatus.SUCCESS) {
            // store.dispatch(setCurrentProfileFriends({ friends: json.body.users }));
            store.dispatch(setFriends({friends: json.body.users}));
        }
        resolveRequest();
    });
}


export const addFriend: TRequest = (resolveRequest, user_id: number) =>
    ajax.post({
        url: `/friends/${user_id}`,
        credentials: true,
    }).then(({ status }) => {
        if (status === AjaxResultStatus.SUCCESS) {
            // TODO do something?
        }
        resolveRequest(user_id);
    });

type TWarningMsgCallack = (warning: string | undefined) => void;

export const loginUser: TRequest = (resolveRequest, 
                                    formData: FormData,
                                    warningMsg: TWarningMsgCallack) => {
    ajax.post<ResponseUserLight, ResponseErrorDefault>({
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
                                       warningMsg: TWarningMsgCallack) => {                   
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
            resolveRequest(formData, warningMsg);
        })
        .catch((error) => {
            console.log("catch:", error);
        });
    }

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
