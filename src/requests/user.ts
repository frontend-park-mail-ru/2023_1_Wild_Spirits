import { ajax } from "modules/ajax";
import { ResponseUserLight, ResponseUserProfile } from "responses/ResponsesUser";
import { ResponseBody } from "responses/ResponseBase";

import { store } from "flux";
import { setData, logout, setCurrentProfile, setCurrentProfileFriends } from "flux/slices/userSlice";
import { close } from "flux/slices/modalWindowSlice";

export const loadAuthorization = () => {
    ajax.get<ResponseUserLight>({
        url: "/authorized",
        credentials: true,
    })
        .then(({ json, response }) => {
            if (response.ok) {
                const csrf = response.headers.get("x-csrf-token");
                if (csrf) {
                    ajax.addHeaders({ "x-csrf-token": csrf });
                }
                store.dispatch(setData(json.body!.user));
            }
        })
        .catch((error) => {
            console.log("catch:", error);
        });
};

export const loadProfile = (id: number) => {
    ajax.get<ResponseUserProfile>({
        url: `/users/${id}`,
        credentials: true,
    })
        .then(({ json, response }) => {
            if (response.ok && json.body) {
                store.dispatch(setCurrentProfile({ profile: json.body.user, id: id }));
            }
        })
        .catch((error) => {
            console.log("catch:", error);
        });
};

export const loadFriends = (user_id: number) => {
    ajax.get<ResponseBody<{ users: { id: number; name: string; img: string }[] }>>({
        url: `/users/${user_id}/friends`,
    }).then(({ json, response }) => {
        if (response.ok && json.body) {
            store.dispatch(setCurrentProfileFriends({ friends: json.body.users }));
        }
    });
};

export const addFriend = (user_id: number) => {
    ajax.post({
        url: `/friends/${user_id}`,
        credentials: true,
    }).then(({ response }) => {
        if (response.ok) {
            // TODO do something?
        }
    });
};

type TWarningMsgCallack = (warning: string | undefined) => void;

export const loginUser = (formData: FormData, warningMsg: TWarningMsgCallack) => {
    ajax.post<ResponseUserLight>({
        url: "/login",
        credentials: true,
        body: { email: formData.get("email"), pass: formData.get("password") },
    })
        .then(({ json, response }) => {
            if (response.ok) {
                const csrf = response.headers.get("x-csrf-token");
                if (csrf) {
                    ajax.addHeaders({ "x-csrf-token": csrf });
                }
                store.dispatch(setData(json.body!.user), close());
            } else {
                warningMsg(json.errorMsg);
            }
        })
        .catch((error) => {
            console.log("catch:", error);
        });
};

export const registerUser = (formData: FormData, warningMsg: TWarningMsgCallack) => {
    ajax.post<ResponseUserLight>({
        url: "/register",
        credentials: true,
        body: {
            email: formData.get("email"),
            pass: formData.get("password"),
            username: formData.get("nickname"),
        },
    })
        .then(({ json, response }) => {
            if (response.ok) {
                const csrf = response.headers.get("x-csrf-token");
                if (csrf) {
                    ajax.addHeaders({ "x-csrf-token": csrf });
                }
                store.dispatch(setData(json.body!.user));
                store.dispatch(close());
            } else {
                warningMsg(json.errorMsg);
            }
        })
        .catch((error) => {
            console.log("catch:", error);
        });
};

export const logoutUser = () => {
    ajax.post({
        url: "/logout",
        credentials: true,
    })
        .then(({ json, response }) => {
            if (response.ok) {
                ajax.removeHeaders("x-csrf-token");
                store.dispatch(logout());
            }
        })
        .catch((error) => {
            console.log("catch:", error);
        });
};
