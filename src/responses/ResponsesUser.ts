import { TUserLight } from "models/User";
import { ResponseBody } from "./ResponseBase";

interface IResponseUser<T> {
    user: T;
}

export interface ResponseUserLight extends ResponseBody<IResponseUser<TUserLight>> {}
