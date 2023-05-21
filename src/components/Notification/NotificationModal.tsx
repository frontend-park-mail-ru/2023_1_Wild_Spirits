import { VDOM, Component } from "modules/vdom";
import { Loading } from "components/Common/Loading";
import { store } from "flux";
import { LoadStatus } from "requests/LoadStatus";
import { Invite } from "./Invite";

export class NotificationModal extends Component {
    render() {
        const { invites } = store.state.notification;
        return (
            <div className="invite-modal-parent">
                <div className="modal__title">Уведомления</div>

                <div className="invite-modal">
                    <div className="notification-modal__subtitle">Приглашения</div>
                    {invites.loadStatus === LoadStatus.LOADING && (
                        <div>
                            <Loading />
                        </div>
                    )}
                    {invites.loadStatus === LoadStatus.DONE &&
                        (invites.data.length === 0 ? (
                            <div>Здесь пусто</div>
                        ) : (
                            <div className="invite-card-container">
                                {invites.data.map((invite) => (
                                    <Invite invite={invite} />
                                ))}
                            </div>
                        ))}
                </div>
                <hr />
                {/* <div>
                    <div className="notification-modal__subtitle">Напоминания</div>
                    {reminder.loadStatus === LoadStatus.LOADING && (
                        <div>
                            <Loading />
                        </div>
                    )}
                </div> */}
            </div>
        );
    }
}
