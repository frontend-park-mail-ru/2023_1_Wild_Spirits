import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseUserEdit, ResponseUserLight, ResponseUserProfile } from "responses/ResponsesUser";
import { ResponseBody, ResponseErrorDefault } from "responses/ResponseBase";

import { store } from "flux";
import {
    setAuthorizedData,
    logout,
    setCurrentProfile,
    authorizedLoadStart,
    authorizedLoadError,
    removeFromFriends,
    FriendState,
    isAuthorizedOrNotDone,
    setOrgId,
    setRecommendedOrgs,
    mineProfile,
} from "flux/slices/userSlice";
import { addToFriendsList, setFoundUsers, setFriends } from "flux/slices/friendsListSlice";
import { closeModal } from "flux/slices/modalWindowSlice";
import { TRequestResolver } from "./requestTypes";
import { addToFriends } from "flux/slices/userSlice";
import { router } from "modules/router";
import { TFriend, TOrganizer, TUserLight } from "models/User";
import { addUploadsUrl } from "modules/getUploadsImg";
import { requestManager } from "requests";
import { createWebSocket, loadInvites } from "./notifications";
import { loadEvents } from "./events";
import { resetEventsCards } from "flux/slices/eventSlice";

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
                store.dispatch(setAuthorizedData(json.body.user), closeModal());
            } else {
                store.dispatch(setAuthorizedData(undefined));
            }
            resolveRequest();
        })
        .catch(() => {
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
                const profile = {
                    ...json.body,
                    friends: addUploadsUrl(json.body.friends),
                };
                store.dispatch(setCurrentProfile({ profile, id: id }));
            }

            resolveRequest();
        })
        .catch(() => {
            resolveRequest();
        });
};

export const patchProfile = (resolveRequest: TRequestResolver, userId: number, formData: FormData) => {
    ajax.removeHeaders("Content-Type");
    ajax.patch<ResponseUserEdit, ResponseErrorDefault>({
        url: `/users/${userId}`,
        credentials: true,
        body: formData,
    }).then(({ json, response, status }) => {
        if (status === AjaxResultStatus.SUCCESS) {
            const { authorized } = store.state.user;
            if (!isAuthorizedOrNotDone(authorized) || !store.state.user.currentProfile) {
                return;
            }

            const userData: TUserLight = {
                id: authorized.data.id,
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                city_name: json.body.user.city_name,
                img: json.body.user.img,
            };

            const currentProfileData: {
                id: number;
                profile: { user: TOrganizer; friends?: TFriend[] | undefined };
            } = {
                id: store.state.user.currentProfile.id,
                profile: {
                    user: {
                        id: store.state.user.currentProfile.id,
                        city_name: json.body.user.city_name,
                        name: formData.get("name") as string,
                        img: json.body.user.img,
                        phone: formData.get("phone") as string,
                        email: formData.get("email") as string,
                        website: (formData.get("website") as string) || undefined,
                    },
                },
            };

            store.dispatch(setAuthorizedData(userData), setCurrentProfile(currentProfileData));
            resolveRequest();
        } else if (response.status === 409) {
            const errorMsgElement = document.getElementById("profile-description-error-message");
            if (errorMsgElement) {
                errorMsgElement.textContent = json.errorMsg || null;
            }
            resolveRequest();
        }
    });
    ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });
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
    }).then(({ json, status }) => {
        if (status === AjaxResultStatus.SUCCESS) {
            store.dispatch(setFriends({ friends: addUploadsUrl(json.body.users) }));
        }
        resolveRequest();
    });
};

export const searchUsers = (resolveRequest: TRequestResolver, name: string) => {
    ajax.get<ResponseBody<{ users: { id: number; name: string; img: string }[] }>>({
        url: "/users",
        urlProps: {
            name: name,
        },
    })
        .then(({ json, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(setFoundUsers({ users: addUploadsUrl(json.body.users) }));
            }
            resolveRequest();
        })
        .catch(() => {
            resolveRequest();
        });
};

export const addFriend = (resolveRequest: TRequestResolver, user: FriendState) =>
    ajax
        .post({
            url: `/friends/${user.id}`,
            credentials: true,
        })
        .then(({ status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(addToFriends(user), addToFriendsList(user));
            }
            resolveRequest();
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
            resolveRequest();
        });

type TWarningMsgCallack = (warning: string | undefined, errors: { [key: string]: string } | undefined) => void;

const clearEvents = () => {
    store.dispatch(resetEventsCards());
    requestManager.request(loadEvents);
};

const updateUserData = () => {
    clearEvents();
    requestManager.request(loadInvites);
    requestManager.request(createWebSocket);
};

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
                    store.dispatch(setAuthorizedData(json.body.user), closeModal());
                }
                updateUserData();
            } else {
                warningMsg(json.errorMsg, json.errors);
            }
            resolveRequest();
        })
        .catch(() => {
            resolveRequest();
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
                    store.dispatch(setAuthorizedData(json.body.user), closeModal());
                }
                updateUserData();
            } else {
                warningMsg(json.errorMsg, json.errors);
            }
            resolveRequest();
        })
        .catch(() => {
            resolveRequest();
        });
};

type ErrorMsgType = {
    errorMsg: string;
    errors: { [key: string]: string };
};

export const registerOrganizer = (
    resolveRequest: TRequestResolver,
    formData: FormData,
    setErrors: (errors: ErrorMsgType) => void
) => {
    const { authorized } = store.state.user;
    ajax.post<{ body: { org_id: number } }>({
        url: "/organizers",
        credentials: true,
        body: {
            name: isAuthorizedOrNotDone(authorized) ? authorized.data.name : "",
            phone: formData.get("phone"),
            website: formData.get("website"),
        },
    })
        .then(({ json, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                router.go("/createevent");
                store.dispatch(setOrgId({ orgId: json.body.org_id }), closeModal());
            } else {
                setErrors({ errorMsg: json.errorMsg, errors: json.errors });
            }
            resolveRequest();
        })
        .catch(() => {
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
                clearEvents();
            }
            resolveRequest();
        })
        .catch(() => {
            resolveRequest();
        });

export const loadOrganizers = (resolveRequest: TRequestResolver) => {
    if (!mineProfile(store.state.user)) {
        return;
    }
    return ajax
        .get<ResponseBody<{ users: { id: number; name: string; img: string }[] }>>({
            url: "/users",
            urlProps: {
                is_organizer: "true",
                page_size: "12",
            },
        })
        .then(({ json, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(setRecommendedOrgs({ orgs: addUploadsUrl(json.body.users) }));
            }
            resolveRequest();
        })
        .catch(() => {
            resolveRequest();
        });
};
