interface TEventDates {
    dateStart?: string;
    dateEnd?: string;
    timeStart?: string;
    timeEnd?: string;
    weekdays?: number[];
}

type TCity = { id: number; name: string };

export interface TEventPlace {
    name: string;
    city: TCity;
    address: string;
    coords: {
        lat: number;
        long: number;
    };
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
