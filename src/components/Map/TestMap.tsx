/** @module Components */

import { VDOM, Component, createDOMNode, JSXToVNode } from "modules/vdom";
import "./styles.scss";
import * as ymaps from "yandex-maps";
import { store } from "flux";
import { loadEvents } from "requests/events";
import { requestManager } from "requests";
import { setEventsCardsLoadStart } from "flux/slices/eventSlice";
import { LoadStatus } from "requests/LoadStatus";
import { EventsLightDataToCardProps } from "models/Events";
import { MapEventCard } from "components/Events/EventCard/MapEventCard";

interface TestMapState {
    map: ymaps.Map | undefined;
}

const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Event list component
 * @class
 * @extends Component
 */
export class TestMap extends Component<any, TestMapState> {
    #timer = 10;

    constructor() {
        super({});
        this.state = { map: undefined };

        this.addMarker = this.addMarker.bind(this);
        this.printMarker = this.printMarker.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    didCreate() {
        window.addEventListener("mouseup", this.handleMouseUp);
        console.error("envents loading . . .");
        store.dispatch(setEventsCardsLoadStart());

        requestManager.request(loadEvents);
    }

    didMount() {
        console.error("TestMap didMount");
        this.createMap();
    }

    didUpdate() {
        console.error("TestMap didUpdate");
    }

    willDestroy() {
        window.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseDown() {
        console.log("mouseUP");
    }

    handleMouseUp() {
        console.log("mouseUP");
    }

    printMarker() {
        console.log(this.#timer);
        if (!this.state.map) {
            return;
        }

        console.log("getCenter", this.state.map.getCenter());
        console.log("getBounds", this.state.map.getBounds());
    }

    addMarker() {
        const { cards } = store.state.events;
        if (this.state.map && cards.loadStatus === LoadStatus.DONE) {
            const cardsProps = EventsLightDataToCardProps(cards.data);
            this.state.map.geoObjects.removeAll();
            for (let i = 0; i < cardsProps.length; i++) {
                const testCard = (
                    createDOMNode(
                        JSXToVNode(
                            <div>
                                <MapEventCard {...cardsProps[i]} />
                            </div>
                        )
                    ) as HTMLElement
                ).innerHTML;

                console.log("inner", testCard);

                const placemark = new ymaps.Placemark([randFloat(52, 58), randFloat(32, 38)], {
                    hintContent: testCard,
                });
                this.state.map.geoObjects.add(placemark);
            }
        }
    }

    createMap() {
        console.error("TestMap createMap");

        const init = () => {
            // Создание карты.
            let ymap = new ymaps.Map("map-container", {
                center: [55.76, 37.64],
                // Уровень масштабирования. Допустимые значения:
                // от 0 (весь мир) до 19.
                zoom: 7,
            });
            this.setState({ map: ymap });
        };

        ymaps.ready(init);
    }

    render() {
        this.addMarker();
        return (
            <div>
                <div
                    id="map-container"
                    className="map map-container"
                    {...{ stopPatch: true }}
                    onMouseUpCapture={() => console.log("UP!!!")}
                ></div>
                <input type="button" onClick={this.addMarker} value="AddMarker" />
                <input type="button" onClick={this.printMarker} value="PrintMarker" />
            </div>
        );
    }
}
