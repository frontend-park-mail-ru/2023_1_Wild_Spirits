import { VDOM, Component } from "modules/vdom";
import { EPFormFieldBase } from "./FormFields";
import { store } from "flux";
import { requestManager } from "requests";
import { findEventPlaces } from "requests/places";
import { selectPlace, setFilterAddress, setFilterName, setPlacesLoadStart } from "flux/slices/placesSlice";
import { LoadStatus } from "requests/LoadStatus";
import { toEvent } from "modules/CastEvents";
import { Loading } from "components/Common/Loading";
import * as ymaps from "yandex-maps";
import { InputField } from "components/Form/FormBase";
import { AjaxResultStatus, ajax } from "modules/ajax";

export interface EventProcessingPlaceProps {
    errorMsg: string | undefined;
}

type PlaceState = "SELECT" | "CREATE";
export interface EventProcessingPlaceState {
    placeState: PlaceState;
}

const SelectContent = () => {
    const { places } = store.state.places;

    const isPlaceSelected = (id: number): boolean => {
        if (store.state.places.selectedPlace === undefined) {
            return false;
        }
        return store.state.places.selectedPlace.id === id;
    };

    const getPlaceClassName = (id: number): string => {
        return `event-processing__place-item ${isPlaceSelected(id) ? "selected" : ""}`;
    };

    const handleChangePlaceSearch = (event: Event) => {
        const target = event.target as HTMLInputElement;

        store.dispatch(setFilterName(target.value), setFilterAddress(target.value), setPlacesLoadStart());
        requestManager.request(findEventPlaces);
    };

    return (
        <div className="event-processing__place-content">
            <input
                type="text"
                className="form-control w-100"
                placeholder="Поиск места"
                onInput={(e) => handleChangePlaceSearch(toEvent(e))}
            />
            {places.loadStatus === LoadStatus.ERROR ? (
                <div className="event-processing__place-items-block">Ошибка загрузки</div>
            ) : places.loadStatus !== LoadStatus.DONE ? (
                <div className="event-processing__place-loading">
                    <Loading />
                </div>
            ) : (
                <div className="event-processing__place-items-block">
                    {places.data.map((place) => (
                        <div
                            className={getPlaceClassName(place.id)}
                            onClick={() => store.dispatch(selectPlace(place.id))}
                        >
                            <div className="event-processing__place-name">{place.name}</div>
                            <div className="event-processing__place-address">{place.address}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface CreateContentProps {
    handleSuccessCreate: () => void;
}

interface CreateContentState {
    name: string;
    errorMsg?: string;
}

class CreateContent extends Component<CreateContentProps, CreateContentState> {
    #ymap: ymaps.Map | undefined = undefined;
    city = "";
    street = "";
    house = "";
    lat = 0;
    lon = 0;

    constructor(props: CreateContentProps) {
        super(props);

        this.state = { name: "" };

        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    didMount(): void {
        this.createMap();
    }

    willDestroy() {
        if (this.#ymap) {
            this.#ymap.destroy();
        }
    }

    handleMapClick(e: ymaps.IEvent) {
        const coords = e.get("coords") as number[];
        ymaps.geocode(coords).then((res) => {
            if (this.#ymap === undefined) {
                return;
            }
            const metaData = res.geoObjects.get(0).properties.get("metaDataProperty", {}) as any;
            const components = metaData?.GeocoderMetaData?.Address?.Components as any[];
            const city = components.find((comp) => comp.kind === "locality")?.name;
            const street = components.find((comp) => comp.kind === "street")?.name;
            const house = components.find((comp) => comp.kind === "house")?.name;

            if (!(city && street && house)) {
                return;
            }

            this.city = city;
            this.street = street;
            this.house = house;
            this.lat = coords[0];
            this.lon = coords[1];

            this.#ymap.geoObjects.removeAll();
            const placemark = new ymaps.Placemark([coords[0], coords[1]], {
                hintContent: `${city}, ${street}, ${house}`,
            });
            this.#ymap.geoObjects.add(placemark);
        });

        console.log("ymap", coords);
    }

    createMap() {
        const init = () => {
            try {
                this.#ymap = new ymaps.Map("event-processing-map-container", {
                    center: [55.76, 37.64],
                    zoom: 15,
                    controls: ["smallMapDefaultSet"],
                });
                this.#ymap.events.add(["click", "contextmenu"], this.handleMapClick);
            } catch {
                this.#ymap = undefined;
            }
        };

        ymaps.ready(init);
    }

    handleNameChange(event: Event) {
        const target = event.target as HTMLInputElement;
        this.setState({ ...this.state, name: target.value });
    }

    handleSubmit() {
        if (this.state.name.trim() === "") {
            this.setState({ ...this.state, errorMsg: "Введите имя!" });
            return;
        }

        if (!(this.city && this.state && this.house)) {
            this.setState({ ...this.state, errorMsg: "Выберите место на карте!" });
            return;
        }

        ajax.post({
            url: "/places",
            credentials: true,
            body: {
                name: this.state.name.trim(),
                address: `${this.street.trim()}, ${this.house.trim()}`,
                city_name: this.city.trim(),
                lat: this.lat,
                lon: this.lon,
            },
        }).then(({ json, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                this.props.handleSuccessCreate();
            } else {
                this.setState({ ...this.state, errorMsg: json.errorMsg });
            }
        });
    }

    render() {
        return (
            <form
                className="event-processing__place-content form event-processing__form"
                id="event-processing-place-create-form"
            >
                <InputField
                    prefix="event-processing"
                    fieldName="name"
                    required={true}
                    title="Название"
                    type="text"
                    value={this.state.name}
                    changeHandler={(e) => this.handleNameChange(toEvent(e))}
                />

                <label className="form-label-required">Выберите место</label>
                <div
                    id="event-processing-map-container"
                    className="event-processing__map"
                    {...{ stopPatch: true }}
                ></div>

                {this.state.errorMsg && (
                    <div className="form-error event-processing__form-error">{this.state.errorMsg}</div>
                )}

                <input
                    className="button"
                    id="event-processing-submit"
                    type="button"
                    value="Создать место"
                    onClick={this.handleSubmit}
                />
            </form>
        );
    }
}

export class EventProcessingPlace extends Component<EventProcessingPlaceProps, EventProcessingPlaceState> {
    constructor(props: EventProcessingPlaceProps) {
        super(props);
        this.state = { placeState: "SELECT" };

        this.changePlaceState = this.changePlaceState.bind(this);
        this.handleSuccessCreate = this.handleSuccessCreate.bind(this);
    }

    changePlaceState(state: PlaceState) {
        this.setState({ placeState: state });
    }

    handleSuccessCreate() {
        this.setState({ placeState: "SELECT" });
    }

    render(): JSX.Element {
        return (
            <div>
                <EPFormFieldBase
                    prefix="event-processing"
                    fieldName="place"
                    title="Место проведения"
                    required={true}
                    errorMsg={this.props.errorMsg}
                >
                    <div className="event-processing__place-block w-100">
                        <div className="tab__wrap">
                            <div
                                className={`tab__item ${this.state.placeState === "SELECT" ? "checked" : ""}`}
                                onClick={() => this.changePlaceState("SELECT")}
                            >
                                Выбрать
                            </div>
                            <div
                                className={`tab__item ${this.state.placeState === "CREATE" ? "checked" : ""}`}
                                onClick={() => this.changePlaceState("CREATE")}
                            >
                                Создать
                            </div>
                        </div>
                        {this.state.placeState === "SELECT" ? (
                            <SelectContent />
                        ) : (
                            <CreateContent handleSuccessCreate={this.handleSuccessCreate} />
                        )}
                    </div>
                </EPFormFieldBase>
            </div>
        );
    }
}
