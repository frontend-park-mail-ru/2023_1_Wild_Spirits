interface TUserBase {
    id: number;
    name: string;
    img: string;
    email: string;
}

export interface TUserLight extends TUserBase {
    city_name: string;
}

export interface TUser extends TUserBase {
    city_name: string;
}

export interface TFriend extends TUserBase {}

export type TUserAvailable = TUserLight | TUser | undefined;
