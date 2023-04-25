import { TagsState } from "flux/slices/tagsSlice";
import { TOrganizer } from "./Organizer";

interface TEventDates {
    dateStart?: string;
    dateEnd?: string;
    timeStart?: string;
    timeEnd?: string;
    weekdays?: number[];
}

type TCity = { id: number; name: string };

export interface TEventPlace {
    id: number;
    name: string;
    lon: number;
    lat: number;
    address: string;
    images: string[];
    city: TCity;
}

export interface TEventBase {
    id: number;
    name: string;
    description: string;
    img: string;
    dates: TEventDates;
}

export interface TOrgLight {
    id: number;
    name: string;
}

export interface TEventLight extends TEventBase {
    places: string[];
    org: TOrgLight;
    //places: TEventPlace[];
}

export interface TEvent extends TEventBase {
    tags: string[];
}

export interface SelectedEventData {
    event: TEvent;
    places: TEventPlace[];
    organizer: TOrganizer;
}

export namespace EventProcessingState {
    export const CREATE = "CREATE";
    export const EDIT = "EDIT";
    export type Type = typeof CREATE | typeof EDIT;
}

export interface EventProcessingForm {
    id: number;
    name: string;
    description: string;
    dateStart?: string;
    dateEnd?: string;
    timeStart?: string;
    timeEnd?: string;
    place: number;
    img: string;
}
