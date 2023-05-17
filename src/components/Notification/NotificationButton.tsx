import {VDOM} from "modules/vdom";

import { HoveredImg } from "components/Common/HoveredImg";
import { store } from "flux";
import { openNotificationModal } from "flux/slices/modalWindowSlice";

export function NotfificationButton() {
    return (
        <HoveredImg
            alt=""
            src="/assets/img/notification-icon.svg"
            iconClassName="notification-icon"
            onClick={() => store.dispatch(openNotificationModal())}
        />
    )
}
