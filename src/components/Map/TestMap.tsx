/** @module Components */

import { VDOM, Component } from "modules/vdom";
import "./styles.scss";
import * as ymaps from "yandex-maps";
/**
 * Event list component
 * @class
 * @extends Component
 */
export class TestMap extends Component {
    constructor() {
        super({});

        this.createMap = this.createMap.bind(this);
    }

    didCreate() {
        console.error("TestMap didCreate");
    }

    didUpdate() {
        console.error("TestMap didUpdate");
    }

    createMap() {
        console.error("TestMap createMap");

        ymaps.ready(init);
        function init() {
            // Создание карты.
            var myMap = new ymaps.Map("map-container", {
                // Координаты центра карты.
                // Порядок по умолчанию: «широта, долгота».
                // Чтобы не определять координаты центра карты вручную,
                // воспользуйтесь инструментом Определение координат.
                center: [55.76, 37.64],
                // Уровень масштабирования. Допустимые значения:
                // от 0 (весь мир) до 19.
                zoom: 7,
            });
            console.warn(myMap);
        }
    }

    render() {
        return (
            <div>
                <div id="map-container" className="map map-container"></div>
                <input type="button" value="Create Map!" onClick={this.createMap} />
            </div>
        );
    }
}
