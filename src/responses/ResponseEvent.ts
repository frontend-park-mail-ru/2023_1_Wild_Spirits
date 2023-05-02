import { TEvent, TEventLight, TEventMap, TEventPlace } from "models/Events";
import { ResponseBody, ResponseBodyOrError } from "./ResponseBase";
import { TOrganizer } from "models/Organizer";

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

export interface ResponseEventsLight extends ResponseBody<IResponseEventsLight> {}

export interface ResponseEvent extends ResponseBody<IResponseEvent> {}
export interface ResponseEventMap extends ResponseBody<IResponseEventMap> {}
