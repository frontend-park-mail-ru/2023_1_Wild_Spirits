import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";
import { TInvite, TReminder } from "models/Notification";
import { LoadStatus } from "requests/LoadStatus";

export interface NotificationState {
    invites: LoadStatus.DataDoneOrNotDone<{ data: TInvite[] }>;
    reminder: LoadStatus.DataDoneOrNotDone<{ data: TReminder[] }>;
}

const initialState: NotificationState = {
    invites: { loadStatus: LoadStatus.NONE },
    reminder: { loadStatus: LoadStatus.NONE },
};

const notificationSlice = createSlice({
    name: "tags",
    initialState: initialState,
    reducers: {},
});

// export const {  } = notificationSlice.actions;
export default notificationSlice;
