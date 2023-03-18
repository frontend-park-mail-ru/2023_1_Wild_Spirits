/** @module Components */

import { Component } from "components/Component";
import CalendarTemplate from "templates/Calendar/Calendar.handlebars";

/**
 * @class
 * @extends Component
 * Component for calendar
 */
export class Calendar extends Component {
    #month;

    static months = [
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
    constructor(parent: Component) {
        super(parent);

        this.#month = new Date().getMonth();

        this.registerEvent(() => document.getElementsByClassName("calendar-date"), "click", this.#toggleDate);
        this.registerEvent(() => document.getElementById("prevMonthBtn"), "click", this.#decrementMonth);
        this.registerEvent(() => document.getElementById("nextMonthBtn"), "click", this.#incrementMonth);
    }

    #toggleDate(event: PointerEvent) {
        const date = event.target as Element;

        if (date.classList.contains("active")) {
            date.classList.remove("active");
        } else if (!date.classList.contains("disabled")) {
            date.classList.add("active");
        }
    }

    #incrementMonth = () => {
        this.#month++;
        this.rerender();
    };
    #decrementMonth = () => {
        this.#month--;
        this.rerender();
    };

    render() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = this.#month;

        const firstMonthDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastMonthDate = new Date(currentYear, currentMonth + 1, 0);

        const firstDate = 2 - firstMonthDay;
        let lastDate = lastMonthDate.getDate() + (7 - lastMonthDate.getDay());

        let days = [];
        for (let d = firstDate; d <= lastDate; d++) {
            const date = new Date(currentYear, currentMonth, d);
            days.push({
                date: date.getDate(),
                active: d > 0 && d <= lastMonthDate.getDate(),
            });
        }

        const rows = Math.ceil(days.length / 7);

        let weeks = [];
        for (let i = 0; i < rows; i++) {
            weeks.push(days.slice(i * 7, (i + 1) * 7));
        }

        return CalendarTemplate({
            month: Calendar.months[this.#month],
            weeks: weeks,
        });
    }
}
