import { getUploadsImg } from "modules/getUploadsImg";
import { TOrganizer } from "./Organizer";
import { EventCardProps } from "components/Events/EventCard/EventCard";

const SLICE_SIZE = 160;

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
    likes: number;
    liked: boolean;
    reminded: boolean;
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

export namespace EventProcessingType {
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

export const EventsLightDataToCardProps = (events: TEventLight[]): EventCardProps[] => {
    return events.map((event: TEventLight) => {
        const { dateStart, dateEnd, timeStart, timeEnd } = event.dates;
        let dates: string[] = [];
        if (dateStart) {
            dates.push("Начало: " + dateStart);
        }
        if (dateEnd) {
            dates.push("Конец: \u00A0\u00A0\u00A0" + dateEnd);
        }
        if (timeStart && timeEnd) {
            dates.push(timeStart + " - " + timeEnd);
        } else if (timeStart || timeEnd) {
            dates.push((timeStart ? timeStart : timeEnd) as string);
        }
        // const places: string[] = event.places.map((place) => place.name);
        const places = event.places;
        return {
            id: event.id,
            name: event.name,
            img: getUploadsImg(event.img),
            description:
                event.description.length > SLICE_SIZE ? event.description.slice(0, SLICE_SIZE) : event.description,
            dates,
            places,
            org: event.org,
            likes: event.likes,
            liked: event.liked
        };
    });
};
