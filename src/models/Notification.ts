export interface TInviteUnique {
    userId: number;
    eventId: number;
}

export interface TInvite extends TInviteUnique {
    userName: string;
    userImg: string;

    eventName: string;
    eventImg: string;
}

export interface TReminder {
    eventId: number;
}
