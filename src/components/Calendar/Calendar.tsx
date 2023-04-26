/** @module Components */

import { createVNode, Component } from "modules/vdom";

import { loadEvents } from "requests/events";

import {
    incrementMonth,
    decrementMonth,
    setStartDate,
    clearStartDate,
    setFinishDate,
    clearFinishDate,
    getMonthName,
} from "flux/slices/calendarSlice";

import { store } from "flux";
import "./styles.scss";
import { requestManager } from "requests";

/**
 * @class
 * @extends Component
 * Component for calendar
 */
export class Calendar extends Component {
    constructor() {
        super({});
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
            store.dispatch(setStartDate({ date: date }));
        } else {
            if (date > startDate) {
                if (finishDate?.getTime() === date.getTime()) {
                    store.dispatch(setStartDate({ date: finishDate }), clearFinishDate());
                } else {
                    store.dispatch(setFinishDate({ date: date }));
                }
            } else if (date < startDate) {
                store.dispatch(setStartDate({ date: date }));
            } else {
                if (finishDate) {
                    store.dispatch(clearFinishDate());
                } else {
                    store.dispatch(clearStartDate());
                }
            }
        }

        requestManager.request(loadEvents);
    }

    #incrementMonth = () => {
        store.dispatch(incrementMonth());
    };
    #decrementMonth = () => {
        store.dispatch(decrementMonth());
    };

    getMonthWeeks = (year: number, month: number) => {
        let firstMonthDay = new Date(year, month, 1).getDay();

        if (firstMonthDay === 0) {
            firstMonthDay = 7;
        }

        const lastMonthDate = new Date(year, month + 1, 0);

        const firstDate = 2 - firstMonthDay;
        let lastDate = lastMonthDate.getDate() + (7 - lastMonthDate.getDay());

        const checkSelection = (date: Date): { isSelected: boolean; isInner: boolean } => {
            const startDate = store.getState().calendar.startDate;

            if (!startDate) {
                return {
                    isSelected: false,
                    isInner: false,
                };
            }

            const finishDate = store.getState().calendar.finishDate;

            if (!finishDate) {
                return {
                    isSelected: date.getTime() == startDate.getTime(),
                    isInner: false,
                };
            }

            return {
                isSelected: date >= startDate && date <= finishDate,
                isInner: date > startDate && date < finishDate,
            };
        };

        const range = (begin: number, end: number) => Array.from(Array(end - begin + 1).keys(), (x) => x + begin);
        const generateDate = (d: number): { date: number; style: string } => {
            const date = new Date(year, month, d);
            const { isSelected, isInner } = checkSelection(date);
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
            };
        };
        const days = range(firstDate, lastDate).map(generateDate);

        return days;

        // const rows = Math.ceil(days.length / 7);
        // const weeks = range(0, rows).map((row) => days.slice(row * 7, (row + 1) * 7));

        // return weeks;
    };

    render(): JSX.Element {
        const currentYear = store.getState().calendar.year;
        const currentMonth = store.getState().calendar.month;

        const month = getMonthName(store.getState().calendar);
        const weeks = this.getMonthWeeks(currentYear, currentMonth);

        console.log(weeks)

        return (
            <div className="calendar">
                <div className="calendar-header">
                    <button className="arrow-button" onClick={this.#decrementMonth}>
                        <img src="/assets/img/arrow-icon.svg" />
                    </button>
                    <div className="calendar-header__month-container">
                        <span className="calendar-header__month">{month}</span>
                        <span className="calendar-header__year">{currentYear.toString()}</span>
                    </div>
                    <button className="arrow-button" onClick={this.#incrementMonth}>
                        <img src="/assets/img/arrow-icon.svg" className="reversed"/>
                    </button>
                </div>
                {/* <table>
                    <tr className="top-row">
                        <th>ПН</th>
                        <th>ВТ</th>
                        <th>СР</th>
                        <th>ЧТ</th>
                        <th>ПТ</th>
                        <th>СБ</th>
                        <th>ВС</th>
                    </tr>
                    {
                        weeks.map(week => (
                            <tr>
                                {week.map(date => (
                                    <td>
                                        <button onClick={(event) => this.#toggleDate(event as unknown as PointerEvent)}
                                            className={`calendar-date current ${date.style}`}>{date.date.toString()}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        ))
                    }
                </table> */}
                <div className="calendar-grid">
                    <div className="calendar__weekday">ПН</div>
                    <div className="calendar__weekday">ВТ</div>
                    <div className="calendar__weekday">СР</div>
                    <div className="calendar__weekday">ЧТ</div>
                    <div className="calendar__weekday">ПТ</div>
                    <div className="calendar__weekday">СБ</div>
                    <div className="calendar__weekday">ВС</div>

                    <div className="calendar__row-border"></div>

                    {
                        weeks.map(date=> (
                            <button onClick={(event) => this.#toggleDate(event as unknown as PointerEvent)}
                                className={`calendar-date current ${date.style}`}>{date.date.toString()}
                            </button>
                        ))
                    }
                </div>
            </div>
        );
    }
}
