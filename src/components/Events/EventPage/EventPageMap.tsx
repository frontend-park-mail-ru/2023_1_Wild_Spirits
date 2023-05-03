/** @module Components */

import { VDOM, Component } from "modules/vdom";
import * as ymaps from "yandex-maps";

interface EventPageMapProps {
    points: {
        lat: number;
        lon: number;
    }[];
}

/**
 * Event list component
 * @class
 * @extends Component
 */
export class EventPageMap extends Component<EventPageMapProps> {
    #ymap: ymaps.Map | undefined = undefined;

    constructor(props: EventPageMapProps) {
        super(props);

        this.addMarker = this.addMarker.bind(this);
    }

    didMount(): void {
        this.createMap();
    }

    willDestroy() {
        if (this.#ymap) {
            this.#ymap.destroy();
        }
    }

    addMarker(map: ymaps.Map) {
        map.geoObjects.removeAll();
        this.props.points.forEach(({ lat, lon }) => {
            const placemark = new ymaps.Placemark([lat, lon], {});
            map.geoObjects.add(placemark);
        });
    }

    createMap() {
        const init = () => {
            try {
                this.#ymap = new ymaps.Map("event-page-map-container", {
                    center: [this.props.points[0].lat, this.props.points[0].lon],
                    zoom: 15,
                });
                this.addMarker(this.#ymap);
            } catch {}
        };

        ymaps.ready(init);
    }

    render() {
        return <div id="event-page-map-container" className="event-page__map" {...{ stopPatch: true }}></div>;
    }
}
