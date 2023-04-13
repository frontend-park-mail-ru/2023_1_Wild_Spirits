import { TEvent, TEventLight, TEventOrganizer, TEventPlace } from "models/Events";
import { ResponseBody, ResponseBodyOrError } from "./ResponseBase";

interface IResponseEventsLight {
    events: TEventLight[];
}

interface IResponseEvent {
    event: TEvent;
    places: TEventPlace[];
    organizer: TEventOrganizer;
}

export interface ResponseEventsLight extends ResponseBody<IResponseEventsLight> {}

export interface ResponseEvent extends ResponseBody<IResponseEvent> {}
