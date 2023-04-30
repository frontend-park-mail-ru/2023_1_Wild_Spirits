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
import { router } from "modules/router";

interface MapState {
    map: ymaps.Map | undefined;
}

const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Event list component
 * @class
 * @extends Component
 */
export class Map extends Component<any, MapState> {
    timer: NodeJS.Timeout | undefined = undefined;
    isMapMouseDown: boolean = false;

    constructor() {
        super({});
        this.state = { map: undefined };

        this.addMarker = this.addMarker.bind(this);
        this.printMarker = this.printMarker.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    didCreate() {
        window.addEventListener("mouseup", this.handleMouseUp);
        store.dispatch(setEventsCardsLoadStart());

        requestManager.request(loadEvents);
    }

    didMount() {
        console.error("TestMap didMount");
        this.createMap();
    }

    willDestroy() {
        window.removeEventListener("mouseup", this.handleMouseUp);
        if (this.state.map) {
            this.state.map.destroy();
        }
    }

    handleMouseDown() {
        console.log("mouseDOWN");
        this.isMapMouseDown = true;
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    handleMouseUp() {
        console.log("mouseUP");
        if (this.isMapMouseDown) {
            this.timer = setTimeout(() => requestManager.request(loadEvents), 1000);
            this.isMapMouseDown = false;
        }
    }

    printMarker() {
        console.log(this.timer);
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

                const placemark = new ymaps.Placemark([randFloat(52, 58), randFloat(32, 38)], {
                    hintContent: testCard,
                });
                placemark.events.add("click", () => router.go(`/events/${cards.data[i].id}`));
                this.state.map.geoObjects.add(placemark);
            }
        }
    }

    createMap() {
        const init = () => {
            let ymap = new ymaps.Map("map-container", {
                center: [55.76, 37.64],
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
                    onMouseDown={this.handleMouseDown}
                ></div>
                <input type="button" onClick={this.addMarker} value="AddMarker" />
                <input type="button" onClick={this.printMarker} value="PrintMarker" />
            </div>
        );
    }
}
