import {VDOM} from "modules/vdom";

import { HoveredImg } from "components/Common/HoveredImg";
import { store } from "flux";
import { openNotificationModal } from "flux/slices/modalWindowSlice";
import { LoadStatus } from "requests/LoadStatus";

export function NotfificationButton() {
    const getNotificationIconSrc = () => {
        if (store.state.notification.invites.loadStatus === LoadStatus.DONE &&
            store.state.notification.invites.data.length > 0) {
            return "/assets/img/new-notification-icon.svg";
        }
        return "/assets/img/notification-icon.svg";
    }

    return (
        <HoveredImg
            alt=""
            src={getNotificationIconSrc()}
            iconClassName="notification-icon"
            onClick={() => store.dispatch(openNotificationModal())}
        />
    )
}
