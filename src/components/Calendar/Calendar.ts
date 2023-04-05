/** @module Components */

import { Component } from "components/Component";
import CalendarTemplate from "templates/Calendar/Calendar.handlebars";

import { incrementMonth, decrementMonth, 
         setStartDate, clearStartDate,
         setFinishDate, clearFinishDate, getMonthName }
from "flux/slices/calendarSlice";

import { store } from "flux";

/**
 * @class
 * @extends Component
 * Component for calendar
 */
export class Calendar extends Component {
    constructor(parent: Component) {
        super(parent);

        this.registerEvent(() => document.getElementsByClassName("calendar-date"), "click", this.#toggleDate);
        this.registerEvent(() => document.getElementById("prevMonthBtn"), "click", this.#decrementMonth);
        this.registerEvent(() => document.getElementById("nextMonthBtn"), "click", this.#incrementMonth);
    }

    #toggleDate(event: PointerEvent) {
        const dateEl = event.target as Element;

        if (!dateEl) {
            return;
        }

        const currentYear = store.getState().calendar.year;
        const currentMonth = store.getState().calendar.month;

        const dateString = dateEl.textContent;

        if (!dateString) {
            return;
        }

        const date = new Date(currentYear, currentMonth, parseInt(dateString));

        const startDate = store.getState().calendar.startDate;

        if (startDate === undefined) {
            store.dispatch(setStartDate({date: date}));
        } else {
            if (date > startDate) {
                store.dispatch(setFinishDate({date: date}));
            } else if (date < startDate) {
                store.dispatch(setStartDate({date: date}));
            } else {
                store.dispatch(clearStartDate());
            }
        }
    }

    #incrementMonth = () => {
        store.dispatch(incrementMonth())
    };
    #decrementMonth = () => {
        store.dispatch(decrementMonth())
    };

    render() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = store.getState().calendar.month;

        const getMonthWeeks = (year: number, month: number) => {
            let firstMonthDay = new Date(currentYear, currentMonth, 1).getDay();

            if (firstMonthDay === 0) {
                firstMonthDay = 7;
            }
    
            const lastMonthDate = new Date(currentYear, currentMonth + 1, 0);
    
            const firstDate = 2 - firstMonthDay;
            let lastDate = lastMonthDate.getDate() + (7 - lastMonthDate.getDay());

            const isSelected = (date: Date) => {
                const startDate = store.getState().calendar.startDate;

                if (!startDate) {
                    return false;
                }

                const finishDate = store.getState().calendar.finishDate;

                if (!finishDate) {
                    return date.getTime() == startDate.getTime();
                }

                return date >= startDate && date <= finishDate;
            }
    
            const range = (begin: number, end: number) => Array.from(Array(end-begin+1).keys(), (x)=>x+begin)
            const generateDate = (d: number): {date: number, active: boolean, selected: boolean} => {
                const date = new Date(currentYear, currentMonth, d)
                return {
                    date: date.getDate(),
                    active: d > 0 && d <= lastMonthDate.getDate(),
                    selected: isSelected(date),
                }
            };
            const days = range(firstDate, lastDate).map(generateDate);
    
            const rows = Math.ceil(days.length / 7);
            const weeks = range(0, rows).map((row)=>days.slice(row*7, (row+1) * 7));

            return weeks;
        }

        return CalendarTemplate({
            month: getMonthName(store.getState().calendar),
            weeks: getMonthWeeks(currentYear, currentMonth),
        });
    }
}
