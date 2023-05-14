import { VDOM, Component } from "modules/vdom";
import { Loading } from "components/Common/Loading";
import { store } from "flux";
import { requestManager } from "requests";
import { LoadStatus } from "requests/LoadStatus";
import { inviteUserToEvent } from "requests/notifications";
import { Invite } from "./Invite";

export class NotificationModal extends Component {
    render() {
        const { invites, reminder } = store.state.notification;
        return (
            <div>
                <div className="modal__title">Уведомления</div>
                <input
                    type="button"
                    value="Test invite"
                    onClick={() => {
                        requestManager.request(inviteUserToEvent, 6, 2);
                    }}
                />
                <div>
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
                            <div>
                                {invites.data.map((invite) => (
                                    <Invite invite={invite} />
                                ))}
                            </div>
                        ))}
                </div>
                <hr />
                <div>
                    <div className="notification-modal__subtitle">Напоминания</div>
                    {reminder.loadStatus === LoadStatus.LOADING && (
                        <div>
                            <Loading />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
