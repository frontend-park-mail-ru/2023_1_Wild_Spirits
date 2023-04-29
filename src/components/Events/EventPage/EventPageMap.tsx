/** @module Components */

import { VDOM, Component } from "modules/vdom";
import "./styles.scss";
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
    constructor(props: EventPageMapProps) {
        super(props);

        this.addMarker = this.addMarker.bind(this);
    }

    didCreate() {
        console.error("EventPageMap didCreate");
    }

    didMount(): void {
        console.error("EventPageMap didMount");
        this.createMap();
    }

    didUpdate() {
        console.error("EventPageMap didUpdate");
    }

    addMarker(map: ymaps.Map) {
        map.geoObjects.removeAll();
        this.props.points.forEach(({ lat, lon }) => {
            const placemark = new ymaps.Placemark([lat, lon], {
                hintContent:
                    "<div><div>Какое-то мероприятие</div> <img width='100px' src='https://kudago.com//media/thumbs/xl/images/event/0e/1a/0e1a08d91c1c0eafb67fc997917fabd3.jpg'></div>",
                balloonContent: "<div style='color:#ff0000'>Это красная метка</div>",
            });
            map.geoObjects.add(placemark);
        });
    }

    createMap() {
        console.error("TestMap createMap");

        const init = () => {
            // Создание карты.
            try {
                let ymap = new ymaps.Map("event-page-map-container", {
                    center: [this.props.points[0].lat, this.props.points[0].lon],
                    zoom: 15,
                });
                this.addMarker(ymap);
            } catch {}
        };

        ymaps.ready(init);
    }

    render() {
        return <div id="event-page-map-container" className="event-page__map" {...{ stopPatch: true }}></div>;
    }
}
