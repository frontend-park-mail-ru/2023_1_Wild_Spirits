import { PayloadAction } from "flux/action";
import { createSlice } from "flux/slice";

export const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];

type DateType = Date | undefined;

interface CalendarState {
    year: number;
    month: number;

    startDate: DateType;
    finishDate: DateType;
}

const initialState: CalendarState = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),

    startDate: undefined,
    finishDate: undefined,
};

const calendarSlice = createSlice({
    name: "calendar",
    initialState: initialState,
    reducers: {
        incrementMonth: (state: CalendarState) => {
            state.month++;
            if (state.month == 12) {
                state.month = 0;
                state.year++;
            }
            return state;
        },
        decrementMonth: (state: CalendarState) => {
            state.month--;
            if (state.month < 0) {
                state.month = 11;
                state.year--;
            }
            return state;
        },
        setStartDate: (state: CalendarState, action: PayloadAction<{ date: DateType }>) => {
            state.startDate = action.payload.date;
            return state;
        },
        clearStartDate: (state: CalendarState) => {
            state.startDate = undefined;
            return state;
        },
        setFinishDate: (state: CalendarState, action: PayloadAction<{ date: DateType }>) => {
            state.finishDate = action.payload.date;
            return state;
        },
        clearFinishDate: (state: CalendarState) => {
            state.finishDate = undefined;
            return state;
        },
    },
});

export const getMonthName = (state: CalendarState) => monthNames[state.month];

export const { incrementMonth, decrementMonth, setStartDate, clearStartDate, setFinishDate, clearFinishDate } =
    calendarSlice.actions;

export default calendarSlice;
