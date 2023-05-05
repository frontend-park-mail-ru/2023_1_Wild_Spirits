import { TEvent, TEventLight, TEventMap, TEventPlace } from "models/Events";
import { ResponseBody } from "./ResponseBase";
import { TOrganizer } from "flux/slices/userSlice";

interface IResponseEventsLight {
    events: TEventLight[];
}

interface IResponseEvent {
    event: TEvent;
    places: TEventPlace[];
    organizer: TOrganizer;
}

interface IResponseEventMap {
    events: TEventMap[];
}

export type ResponseEventsLight = ResponseBody<IResponseEventsLight>;
export type ResponseEvent = ResponseBody<IResponseEvent>;
export type ResponseEventMap = ResponseBody<IResponseEventMap>;
