import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseUserLight, ResponseUserProfile } from "responses/ResponsesUser";
import { ResponseBody, ResponseErrorDefault } from "responses/ResponseBase";

import { store } from "flux";
import {
    setUserData,
    logout,
    setCurrentProfile,
    authorizedLoadStart,
    authorizedLoadError,
    removeFromFriends,
} from "flux/slices/userSlice";
import { setFoundUsers, setFriends } from "flux/slices/friendsListSlice";
import { close } from "flux/slices/modalWindowSlice";
import { TRequestResolver } from "./requestTypes";
import { App } from "components/App";
import { addToFriends } from "flux/slices/userSlice";
import { router } from "modules/router";

export const loadAuthorization = (resolveRequest: TRequestResolver) => {
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
                store.dispatch(setUserData(json.body.user), close());
            } else {
                store.dispatch(setUserData(undefined));
            }
            resolveRequest();
        })
        .catch((error) => {
            store.dispatch(authorizedLoadError());
        });
};

export const loadProfile = (resolveRequest: TRequestResolver, id: number) => {
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
            resolveRequest(id);
        });
};

export const loadFriends = (resolveRequest: TRequestResolver, user_id: number, search?: string) => {
    let urlProps = {};
    if (search !== undefined && search.length > 0) {
        urlProps = {
            name: search,
        };
    }
    ajax.get<ResponseBody<{ users: { id: number; name: string; img: string }[] }>>({
        url: `/users/${user_id}/friends`,
        urlProps: urlProps,
    }).then(({ json, response, status }) => {
        if (status === AjaxResultStatus.SUCCESS) {
            // store.dispatch(setCurrentProfileFriends({ friends: json.body.users }));
            store.dispatch(setFriends({ friends: json.body.users }));
        }
        resolveRequest(user_id, search);
    });
};

export const searchUsers = (resolveRequest: TRequestResolver, name: string) => {
    ajax.get<ResponseBody<{ users: { id: number; name: string; img: string }[] }>>({
        url: "/users",
        urlProps: {
            name: name,
        },
    }).then(({ json, response, status }) => {
        if (status === AjaxResultStatus.SUCCESS) {
            store.dispatch(setFoundUsers({ users: json.body.users }));
        }
        resolveRequest();
    });
};

export const addFriend = (resolveRequest: TRequestResolver, user_id: number) =>
    ajax
        .post({
            url: `/friends/${user_id}`,
            credentials: true,
        })
        .then(({ status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(addToFriends());
            }
            resolveRequest(user_id);
        });

export const deleteFriend = (resolveRequest: TRequestResolver, user_id: number) =>
    ajax
        .delete({
            url: `/friends/${user_id}`,
            credentials: true,
        })
        .then(({ status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(removeFromFriends());
            }
            resolveRequest(user_id);
        });

type TWarningMsgCallack = (warning: string | undefined, errors: { [key: string]: string } | undefined) => void;

export const loginUser = (resolveRequest: TRequestResolver, formData: FormData, warningMsg: TWarningMsgCallack) => {
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
                    store.dispatch(setUserData(json.body.user), close());
                }
            } else {
                warningMsg(json.errorMsg, json.errors);
            }
            resolveRequest(formData, warningMsg);
        })
        .catch((error) => {
            console.log("catch:", error);
        });
};

export const registerUser = (resolveRequest: TRequestResolver, formData: FormData, warningMsg: TWarningMsgCallack) => {
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
                store.dispatch(setUserData(json.body.user), close());
            } else {
                warningMsg(json.errorMsg, json.errors);
            }
            resolveRequest(formData, warningMsg);
        })
        .catch((error) => {
            console.log("catch:", error);
        });
};

export const registerOrganizer = (resolveRequest: TRequestResolver, formData: FormData) => {
    ajax.post({
        url: "/organizers",
        credentials: true,
        body: {
            name: store.state.user.data!.name,
            phone: formData.get("phone"),
            website: formData.get("website"),
        },
    }).then(({ json, response, status }) => {
        if (status === AjaxResultStatus.SUCCESS) {
            router.go("/createevent");
            store.dispatch(close());
        }
        resolveRequest();
    });
};

export const logoutUser = (resolveRequest: TRequestResolver) =>
    ajax
        .post({
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
