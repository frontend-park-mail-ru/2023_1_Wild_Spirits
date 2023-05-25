import { Loading } from "components/Common/Loading";
import { VDOM, Component } from "modules/vdom";

export class EventCarousel extends Component {
    render() {
        const cardClassName = "col-6 event-card-container";
        return (
            <div className="event-carousel">
                <div className="event-carousel__title">title</div>
                <div className="row-no-wrap event-carousel__content-block">
                    <img src="/assets/img/arrow-icon.svg" alt="prev" className="event-carousel__prev-next disable" />
                    <div className="row-no-wrap event-carousel__card-block">
                        <div className={cardClassName}>
                            <div className="card event-card event-card-loading">
                                <Loading size="xl" />
                            </div>
                        </div>
                        <div className={cardClassName}>
                            <div className="card event-card event-card-loading">
                                <Loading size="xl" />
                            </div>
                        </div>
                    </div>
                    <img
                        src="/assets/img/arrow-icon.svg"
                        alt="next"
                        className="reversed pointy event-carousel__prev-next"
                    />
                </div>
            </div>
        );
    }
}
