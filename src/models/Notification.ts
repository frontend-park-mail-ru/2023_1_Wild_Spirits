export interface TInvite {
    userId: number;
    userName: string;
    userImg: string;

    eventId: number;
    eventName: string;
    eventImg: string;
}

export interface TReminder {
    eventId: number;
}
