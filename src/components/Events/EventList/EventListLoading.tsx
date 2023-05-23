import { VDOM } from "modules/vdom";
import { Loading } from "components/Common/Loading";

export interface EventListLoadingProps {
    size: number;
}

export const EventListLoading = ({ size }: EventListLoadingProps) => {
    return (
        <div className="event-list row">
            {Array.from(Array(size)).map(() => (
                <div className="card event-card col-l-12 col-xxl-6 col-4 event-card-loading">
                    <Loading size="xl" />
                </div>
            ))}
        </div>
    );
};
