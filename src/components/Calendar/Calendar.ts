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
        const finishDate = store.getState().calendar.finishDate;

        if (startDate === undefined) {
            store.dispatch(setStartDate({date: date}));
        } else {
            if (date > startDate) {
                if (finishDate?.getTime() === date.getTime()) {
                    store.dispatch(setStartDate({date: finishDate}), clearFinishDate());
                } else {
                    store.dispatch(setFinishDate({date: date}));
                }
            } else if (date < startDate) {
                store.dispatch(setStartDate({date: date}));
            } else {
                if (finishDate) {
                    store.dispatch(clearFinishDate());
                } else {
                    store.dispatch(clearStartDate());
                }
            }
        }
    }

    #incrementMonth = () => {
        store.dispatch(incrementMonth())
    };
    #decrementMonth = () => {
        store.dispatch(decrementMonth())
    };

    getMonthWeeks = (year: number, month: number) => {
        let firstMonthDay = new Date(year, month, 1).getDay();

        if (firstMonthDay === 0) {
            firstMonthDay = 7;
        }

        const lastMonthDate = new Date(year, month + 1, 0);

        const firstDate = 2 - firstMonthDay;
        let lastDate = lastMonthDate.getDate() + (7 - lastMonthDate.getDay());

        const checkSelection = (date: Date): {isSelected: boolean, isInner: boolean} => {
            const startDate = store.getState().calendar.startDate;

            if (!startDate) {
                return {
                    isSelected: false,
                    isInner: false
                };
            }

            const finishDate = store.getState().calendar.finishDate;

            if (!finishDate) {
                return {
                    isSelected: date.getTime() == startDate.getTime(),
                    isInner: false
                }
            }

            return {
                isSelected: date >= startDate && date <= finishDate,
                isInner: date > startDate && date < finishDate
            }
        }

        const range = (begin: number, end: number) => Array.from(Array(end-begin+1).keys(), (x)=>x+begin)
        const generateDate = (d: number): {date: number, style: string} => {
            const date = new Date(year, month, d);
            const {isSelected, isInner} = checkSelection(date);
            const isActive = d > 0 && d <= lastMonthDate.getDate();

            let style = "";

            if (!isActive) {
                style = "disabled";
            } else if (isSelected) {
                if (isInner) {
                    style = "inner-active";
                } else {
                    style = "active";
                }
            }

            return {
                date: date.getDate(),
                style: style,
            }
        };
        const days = range(firstDate, lastDate).map(generateDate);

        const rows = Math.ceil(days.length / 7);
        const weeks = range(0, rows).map((row)=>days.slice(row*7, (row+1) * 7));

        return weeks;
    }

    render() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = store.getState().calendar.month;

        return CalendarTemplate({
            month: getMonthName(store.getState().calendar),
            weeks: this.getMonthWeeks(currentYear, currentMonth),
        });
    }
}
