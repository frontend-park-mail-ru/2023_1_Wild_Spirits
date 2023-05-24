import { VDOM } from "modules/vdom";
import { Loading } from "components/Common/Loading";

export interface EventListLoadingProps {
    size: number;
    className?: string;
}

export const EventListLoading = ({ size, className }: EventListLoadingProps) => {
    className = className || "";
    return (
        <div className="event-list row">
            {Array.from(Array(size)).map(() => (
                <div className={className}>
                    <div className="card event-card event-card-loading">
                        <Loading size="xl" />
                    </div>
                </div>
            ))}
        </div>
    );
};
