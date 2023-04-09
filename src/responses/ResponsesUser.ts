import { TUserLight, TUser } from "models/User";
import { ResponseBody } from "./ResponseBase";

interface IResponseUser<T> {
    user: T;
}

export interface ResponseUserLight extends ResponseBody<IResponseUser<TUserLight>> {}
export interface ResponseUserProfile extends ResponseBody<IResponseUser<TUser>> {}
export interface ResponseUserEdit extends ResponseBody<IResponseUser<TUser>> {}
