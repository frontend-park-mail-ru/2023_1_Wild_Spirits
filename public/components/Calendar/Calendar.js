/** @module Components */

import { Component } from "/components/Component.js";
import CalendarTemplate from "/compiled/Calendar/Calendar.handlebars.js";

/**
 * @class
 * @extends Component
 * Component for calendar
 */
export class Calendar extends Component {
    constructor(parent) {
        super(parent)
    }

    render() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const firstMonthDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastMonthDate = new Date(currentYear, currentMonth + 1, 0);

        const firstDate = 2 - firstMonthDay;
        let lastDate = lastMonthDate.getDate() + (7 - lastMonthDate.getDay());

        let days = []
        for (let d = firstDate; d <= lastDate; d++) {
            const date = new Date(currentYear, currentMonth, d);
            days.push(date.getDate())
        }

        const rows = Math.ceil(days.length / 7);

        let weeks = []
        for (let i = 0; i < rows; i++) {
            weeks.push(days.slice(i * 7, (i + 1) * 7));
        }

        return CalendarTemplate({
            weeks: weeks
        });
    }
}
