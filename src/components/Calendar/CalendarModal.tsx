import { VDOM } from "modules/vdom";
import { ModalWindow } from "components/ModalWindow/ModalWindow";
import { store } from "flux";
import { Calendar } from "./Calendar";

import { closeModal } from "flux/slices/modalWindowSlice";

export const CalendarModal = () => {
    return (
        <ModalWindow>
            <div className="calendar-container" onMouseDown={(e) => e.stopPropagation()}>
                <Calendar />
                <button
                    className="calendar-modal__close-button"
                    onClick={() => {
                        store.dispatch(closeModal());
                    }}
                >
                    Закрыть
                </button>
            </div>
        </ModalWindow>
    );
};
