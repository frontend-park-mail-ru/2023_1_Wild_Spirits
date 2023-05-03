/** @module Components */

import { VDOM, Component, createDOMNode, JSXToVNode } from "modules/vdom";
import * as ymaps from "yandex-maps";
import { store } from "flux";
import { loadEnventsMap } from "requests/events";
import { requestManager } from "requests";
import { setEventsCardsLoadStart } from "flux/slices/eventSlice";
import { MapEventCard } from "components/Events/EventCard/MapEventCard";
import { router } from "modules/router";
import { fixEventDates } from "models/Events";
import { getUploadsImg } from "modules/getUploadsImg";

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
        this.loadGeoEvents = this.loadGeoEvents.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    didCreate() {
        window.addEventListener("mouseup", this.handleMouseUp);
        store.dispatch(setEventsCardsLoadStart());
    }

    didMount() {
        this.createMap();
    }

    willDestroy() {
        window.removeEventListener("mouseup", this.handleMouseUp);
        if (this.state.map) {
            this.state.map.destroy();
        }
    }

    handleMouseDown() {
        this.isMapMouseDown = true;
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    loadGeoEvents() {
        if (!this.state.map) {
            return;
        }
        const coords = this.state.map.getBounds();
        requestManager.request(loadEnventsMap, coords[0][1], coords[1][1], coords[0][0], coords[1][0]);
    }

    handleMouseUp() {
        if (this.isMapMouseDown) {
            this.timer = setTimeout(this.loadGeoEvents, 1000);
            this.isMapMouseDown = false;
        }
    }

    addMarker() {
        const { mapEvents } = store.state.events;
        if (this.state.map) {
            this.state.map.geoObjects.removeAll();
            for (const event of mapEvents) {
                const card = (
                    createDOMNode(
                        JSXToVNode(
                            <div>
                                <MapEventCard
                                    id={event.id}
                                    name={event.name}
                                    img={getUploadsImg(event.img)}
                                    dates={fixEventDates(event.dates)}
                                />
                            </div>
                        )
                    ) as HTMLElement
                ).innerHTML;

                const placemark = new ymaps.Placemark([event.coords.lat, event.coords.lon], {
                    hintContent: card,
                });
                placemark.events.add("click", () => router.go(`/events/${event.id}`));
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
            const coords = ymap.getBounds();
            requestManager.request(loadEnventsMap, coords[0][1], coords[1][1], coords[0][0], coords[1][0]);
        };

        ymaps.ready(init);
    }

    render() {
        this.addMarker();
        return (
            <div className="map-page">
                <div
                    id="map-container"
                    className="map map-container"
                    {...{ stopPatch: true }}
                    onMouseDown={this.handleMouseDown}
                ></div>
            </div>
        );
    }
}
