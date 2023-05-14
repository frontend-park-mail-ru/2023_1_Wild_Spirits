import { TInvite } from "models/Notification";
import { ResponseBody } from "./ResponseBase";

interface IResponseInvites {
    invites: TInvite[];
}

export type ResponseInvites = ResponseBody<IResponseInvites>;
