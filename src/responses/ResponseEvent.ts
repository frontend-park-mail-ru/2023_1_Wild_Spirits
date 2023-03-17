import { TEventLight } from "models/Events";
import { ResponseBody } from "./ResponseBase";

interface IResponseEvent<T> {
    events: T[];
}

export interface ResponseEventLight extends ResponseBody<IResponseEvent<TEventLight>> {}
