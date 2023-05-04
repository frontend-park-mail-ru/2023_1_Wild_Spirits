import { ModalWindow } from "components/ModalWindow/ModalWindow";
import { store } from "flux";
import { closeCalendarModal } from "flux/slices/metaSlice";
import {VDOM} from "modules/vdom";
import { Calendar } from "./Calendar";

export const CalendarModal = () => {
    return (
        // <div className="calendar-modal">
        //     <div className="calendar-container">
        //         <Calendar/>
        //         <button 
        //             className="calendar-modal__close-button"
        //             onClick={()=>store.dispatch(closeCalendarModal())}
        //         >
        //             Отмена
        //         </button>
        //     </div>
        // </div>

        <ModalWindow>
            <Calendar/>
            <button 
                className="calendar-modal__close-button"
                onClick={()=>store.dispatch(closeCalendarModal())}
            />
        </ModalWindow>
    )
}
