export interface TUserLight {
    name: string;
    img: string;
}

export interface TUser {
    name: string;
    img: string;
}

export type TUserAvailable = TUserLight | TUser | undefined;
