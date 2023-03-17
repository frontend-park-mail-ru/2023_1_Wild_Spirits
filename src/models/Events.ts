interface TEventDates {
    dateStart?: string;
    dateEnd?: string;
    timeStart?: string;
    timeEnd?: string;
    weekdays?: number[];
}

interface TEventPlace {
    name: string;
    city: string;
    coords: {
        lat: number;
        long: number;
    };
}

export interface TEventBase {
    id: number;
    name: string;
    desc: string;
}

export interface TEventLight extends TEventBase {
    img: string;
    dates: TEventDates;
    places: string[];
    //places: TEventPlace[];
}
