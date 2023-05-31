import { TEvent, TEventLight, TEventMap, TEventPlace } from "models/Events";
import { ResponseBody } from "./ResponseBase";
import { TOrganizer } from "models/User";

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
