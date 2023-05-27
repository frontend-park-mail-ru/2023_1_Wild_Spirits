import { VDOM } from "modules/vdom";
import { Loading } from "components/Common/Loading";
import { TEventLight, eventsLightDataToCardProps } from "models/Events";
import { LoadStatus } from "requests/LoadStatus";
import { EventCard, EventCardProps } from "../EventCard/EventCard";

export interface EventCarouselContentProps {
    events: LoadStatus.DataDoneOrNotDone<{ data: TEventLight[] }>;
    pageSize: number;
    start: number;
    cardClassName: string;
}

export const EventCarouselContent = ({ events, pageSize, start, cardClassName }: EventCarouselContentProps) => {
    if (events.loadStatus === LoadStatus.LOADING || events.loadStatus === LoadStatus.NONE) {
        return (
            <div className="row-no-wrap event-carousel__card-block">
                {Array.from(Array(pageSize)).map(() => (
                    <div className={cardClassName}>
                        <div className="card event-card event-card-loading">
                            <Loading size="xl" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (events.loadStatus !== LoadStatus.DONE) {
        return <div>Error</div>;
    }

    const cardsProps: EventCardProps[] = eventsLightDataToCardProps(events.data);
    if (cardsProps.length === 0) {
        return (
            <div className="row-no-wrap event-carousel__card-block">
                <div className="col-12">Тут пусто</div>
            </div>
        );
    }
    const cards: JSX.Element[] = [];
    for (let i = start; i < Math.min(start + pageSize, cardsProps.length); i++) {
        cards.push(<EventCard {...cardsProps[i]} className={cardClassName} />);
    }

    return <div className="row-no-wrap event-carousel__card-block">{cards}</div>;
};
