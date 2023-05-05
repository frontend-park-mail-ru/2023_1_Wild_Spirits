import { TUserLight, TUser } from "models/User";
import { ResponseBody } from "./ResponseBase";

interface IResponseUser<T> {
    user: T;
}

export type ResponseUserLight = ResponseBody<IResponseUser<TUserLight>>;
export type ResponseUserProfile = ResponseBody<IResponseUser<TUser>>;
export type ResponseUserEdit = ResponseBody<IResponseUser<TUser>>;
