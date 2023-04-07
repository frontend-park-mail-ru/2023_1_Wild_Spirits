import { TEvent, TEventLight, TEventPlace } from "models/Events";
import { ResponseBody } from "./ResponseBase";

interface IResponseEventsLight {
    events: TEventLight[];
}

interface IResponseEvent {
    event: TEvent;
    places: TEventPlace[];
}

export interface ResponseEventsLight extends ResponseBody<IResponseEventsLight> {}

export interface ResponseEvent extends ResponseBody<IResponseEvent> {}
