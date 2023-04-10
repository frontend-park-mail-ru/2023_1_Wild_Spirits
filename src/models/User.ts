export interface TUserLight {
    name: string;
    img: string;
}

export interface TUser {
    name: string;
    img: string;
    city_name: string;
}

export type TUserAvailable = TUserLight | TUser | undefined;
