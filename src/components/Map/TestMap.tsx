/** @module Components */

import { VDOM, Component } from "modules/vdom";
import "./styles.scss";
import * as ymaps from "yandex-maps";

interface TestMapState {
    map: ymaps.Map | undefined;
}

/**
 * Event list component
 * @class
 * @extends Component
 */
export class TestMap extends Component<any, TestMapState> {
    constructor() {
        super({});
        this.state = { map: undefined };

        this.addMarker = this.addMarker.bind(this);
    }

    didCreate() {
        console.error("TestMap didCreate");
    }

    didMount(): void {
        console.error("TestMap didMount");
        this.createMap();
    }

    didUpdate() {
        console.error("TestMap didUpdate");
    }

    addMarker() {
        if (!this.state.map) {
            return;
        }
        const placemark = new ymaps.Placemark([55.37, 35.45], {
            hintContent:
                "<div><div>Какое-то мероприятие</div> <img width='100px' src='https://kudago.com//media/thumbs/xl/images/event/0e/1a/0e1a08d91c1c0eafb67fc997917fabd3.jpg'></div>",
            balloonContent: "<div style='color:#ff0000'>Это красная метка</div>",
        });
        this.state.map.geoObjects.removeAll();
        this.state.map.geoObjects.add(placemark);
    }

    createMap() {
        console.error("TestMap createMap");

        const init = () => {
            // Создание карты.
            let ymap = new ymaps.Map("map-container", {
                // Координаты центра карты.
                // Порядок по умолчанию: «широта, долгота».
                // Чтобы не определять координаты центра карты вручную,
                // воспользуйтесь инструментом Определение координат.
                center: [55.76, 37.64],
                // Уровень масштабирования. Допустимые значения:
                // от 0 (весь мир) до 19.
                zoom: 7,
            });
            const placemark = new ymaps.Placemark([55.37, 35.45], {
                hintContent:
                    "<div><div>Какое-то мероприятие</div> <img width='100px' src='https://kudago.com//media/thumbs/xl/images/event/0e/1a/0e1a08d91c1c0eafb67fc997917fabd3.jpg'></div>",
                balloonContent: "<div style='color:#ff0000'>Это красная метка</div>",
            });
            ymap.geoObjects.add(placemark);
            ymap.geoObjects.remove(placemark);
            this.setState({ map: ymap });
        };

        ymaps.ready(init);
    }

    render() {
        return (
            <div>
                <div id="map-container" className="map map-container" {...{ stopPatch: true }}></div>
                <input type="button" onClick={this.addMarker} value="AddMarker" />
            </div>
        );
    }
}
