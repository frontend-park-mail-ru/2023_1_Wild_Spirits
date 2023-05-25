import { VDOM } from "modules/vdom";
interface EventCardMarkProps {
    img_src: string;
    title: string;
    items: string[];
    className?: string;
}

export const EventCardMarker = ({ img_src, title, items, className }: EventCardMarkProps) => {
    className = `event-card__marked ${className || ""}`;
    return (
        <div className={className}>
            <div className="event-card__logo-block">
                <img className="event-card__logo" src={img_src} alt={title} />
            </div>
            <div className="event-card__marked-content-block">
                {items.map((item) => (
                    <div className="event-card__marked-content">
                        <div className="event-card__marked-text">{item}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
