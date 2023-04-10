interface TEventDates {
    dateStart?: string;
    dateEnd?: string;
    timeStart?: string;
    timeEnd?: string;
    weekdays?: number[];
}

export interface TEventPlace {
    name: string;
    city: string;
    coords: {
        lat: number;
        long: number;
    };
}

export interface TEventOrganizer {
    id: number;
    name: string;
    email: string;
    phone: string;
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

export interface TEvent extends TEventBase {}
