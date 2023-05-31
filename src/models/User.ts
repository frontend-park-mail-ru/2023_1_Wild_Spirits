export interface TUserBase {
    id: number;
    name: string;
    img: string;
    email?: string;
}

export interface TUserLight extends TUserBase {
    city_name: string;
}

export interface TUser extends TUserBase {
    city_name: string;
}

export type TFriend = TUserBase;

export type TUserAvailable = TUserLight | TUser | undefined;

export interface TOrganizer extends TUser {
    org_id?: number;
    user_id?: number;
    phone?: string;
    website?: string;
}
