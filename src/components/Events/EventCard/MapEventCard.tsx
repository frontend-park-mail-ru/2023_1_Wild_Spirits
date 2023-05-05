/** @module Components */

import { VDOM, Component } from "modules/vdom";
import { Link } from "components/Common/Link";

export interface MapEventCardProps {
    id: number;
    name: string;
    img: string;
    dates: string[];
}

/**
 * event card component
 * @class
 * @extends Component
 */
export class MapEventCard extends Component<MapEventCardProps> {
    constructor(props: MapEventCardProps) {
        super(props);
    }

    render() {
        return (
            <div className="map-event-card">
                <Link id={`event_${this.props.id}`} className="event-card__content" href={`/events/${this.props.id}`}>
                    <div className="card__img-block">
                        <img className="card__img" src={this.props.img} alt={this.props.name} />
                    </div>
                    <div className="map-event-card__title">{this.props.name}</div>
                    <div>
                        {this.props.dates.map((item) => (
                            <div>{item}</div>
                        ))}
                    </div>
                </Link>
            </div>
        );
    }
}
