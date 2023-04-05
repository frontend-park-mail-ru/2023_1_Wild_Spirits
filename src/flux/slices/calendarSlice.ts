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

interface CalendarState {
    year: number,
    month: number,

    startDate: Date | undefined,
    finishDate: Date | undefined
}

const initialState: CalendarState = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),

    startDate: undefined,
    finishDate: undefined
}

const calendarSlice = createSlice({
    name: "calendar",
    initialState: initialState,
    reducers: {
        incrementMonth: (state) => {
            state.month++;
            if (state.month == 12) {
                state.month = 0;
                state.year++;
            }
            return state;
        },
        decrementMonth: (state) => {
            state.month--;
            if (state.month < 0 ) {
                state.month = 11;
                state.year--;
            }
            return state;
        },
        setStartDate: (state, action) => {
            state.startDate = action.payload.date;
            return state;
        },
        clearStartDate: (state) => {
            state.startDate = state.finishDate;
            state.finishDate = undefined;
            return state;
        },
        setFinishDate: (state, action) => {
            state.finishDate = action.payload.date;
            return state;
        },
        clearFinishDate: (state) => {
            state.finishDate = undefined;
            return state;
        }
    }
});

export const getMonthName = (state: CalendarState) => monthNames[state.month];

export const {
    incrementMonth,
    decrementMonth, 
    setStartDate,
    clearStartDate,
    setFinishDate,
    clearFinishDate
        } = calendarSlice.actions;

export default calendarSlice;
