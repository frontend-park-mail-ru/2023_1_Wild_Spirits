import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";
import { TInvite, TInviteUnique, TReminder } from "models/Notification";
import { LoadStatus } from "requests/LoadStatus";

export interface NotificationState {
    invites: LoadStatus.DataDoneOrNotDone<{ data: TInvite[] }>;
    reminder: LoadStatus.DataDoneOrNotDone<{ data: TReminder[] }>;
}

const initialState: NotificationState = {
    invites: { loadStatus: LoadStatus.LOADING },
    reminder: { loadStatus: LoadStatus.LOADING },
};

const notificationSlice = createSlice({
    name: "notification",
    initialState: initialState,
    reducers: {
        setInvitesLoadStart: (state: NotificationState) => {
            state.invites = { loadStatus: LoadStatus.LOADING };
            return state;
        },
        setInvites: (state: NotificationState, action: PayloadAction<TInvite[]>) => {
            state.invites = { loadStatus: LoadStatus.DONE, data: action.payload };
            return state;
        },
        addInvite: (state: NotificationState, action: PayloadAction<TInvite>) => {
            if (state.invites.loadStatus === LoadStatus.DONE) {
                state.invites.data.push(action.payload);
            }
            return state;
        },
        setInvitesLoadError: (state: NotificationState) => {
            state.invites = { loadStatus: LoadStatus.ERROR };
            return state;
        },
        removeInvite: (state: NotificationState, action: PayloadAction<TInviteUnique>) => {
            const inviteUnique = action.payload;
            if (state.invites.loadStatus === LoadStatus.DONE) {
                state.invites.data = state.invites.data.filter(invite => invite.eventId !== inviteUnique.eventId || invite.userId !== inviteUnique.userId);
            }
            return state;
        }
    },
});

export const { setInvitesLoadStart, setInvites, addInvite, setInvitesLoadError, removeInvite } = notificationSlice.actions;
export default notificationSlice;
