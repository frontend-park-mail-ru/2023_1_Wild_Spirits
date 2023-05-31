import { getUploadsImg } from "modules/getUploadsImg";
import { EventCardProps } from "components/Events/EventCard/EventCard";
import { TOrganizer } from "./User";

const SLICE_SIZE = 160;

export interface TEventDates {
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
    is_mine: boolean;
    categories: string[] | null;
}

export interface TEventMap extends TEventBase {
    coords: { lat: number; lon: number };
}

export interface TOrgLight {
    id: number;
    name: string;
}

export interface TEventLight extends TEventBase {
    places: string[];
    org: TOrgLight;
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
    category: string;
    dateStart?: string;
    dateEnd?: string;
    timeStart?: string;
    timeEnd?: string;
    img: string;
    tags: string;

    place: string;
}

export const fixEventDates = (dates: TEventDates): string[] => {
    const { dateStart, dateEnd, timeStart, timeEnd } = dates;
    const result: string[] = [];
    if (dateStart) {
        result.push("Начало: " + dateStart);
    }
    if (dateEnd) {
        result.push("Конец: \u00A0\u00A0\u00A0" + dateEnd);
    }
    if (timeStart && timeEnd) {
        result.push(timeStart + " - " + timeEnd);
    } else if (timeStart || timeEnd) {
        result.push((timeStart ? timeStart : timeEnd) as string);
    }

    return result;
};

export const eventsLightDataToCardProps = (events: TEventLight[]): EventCardProps[] => {
    return events.map((event: TEventLight) => {
        const dates: string[] = fixEventDates(event.dates);

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
            liked: event.liked,
            is_mine: event.is_mine,
            reminded: event.reminded,
        };
    });
};
