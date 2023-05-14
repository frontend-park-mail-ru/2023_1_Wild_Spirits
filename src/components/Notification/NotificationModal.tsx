import { VDOM, Component } from "modules/vdom";

export class NotificationModal extends Component {
    render() {
        return (
            <div>
                <div className="modal__title">Уведомления</div>
                <div>
                    <div className="notification-modal__subtitle">Приглашения</div>
                </div>
                <hr />
                <div>
                    <div className="notification-modal__subtitle">Напоминания</div>
                </div>
            </div>
        );
    }
}
