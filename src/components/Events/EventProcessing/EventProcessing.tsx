import { VDOM, Component } from "modules/vdom";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { router } from "modules/router";
import { toWebP } from "modules/imgConverter";
import { store } from "flux";
import { kickUnauthorized } from "flux/slices/userSlice";
import { LoadStatus } from "requests/LoadStatus";
import "./styles.scss";
import { EventProcessingForm, EventProcessingState } from "models/Events";
import {
    setEventProcessingErrorMsg,
    setEventProcessingFormDataField,
    setEventProcessingFormImg,
    setEventProcessingLoadStart,
    toggleEventProcessingTag,
} from "flux/slices/eventSlice";
import { requestManager } from "requests";
import { loadEventProcessingCreate, loadEventProcessingEdit } from "requests/events";
import { dateToServer } from "modules/dateParser";
import { Tags, ToggleTagFuncProps } from "components/Tags/Tags";
import { toEvent, toSubmitEvent } from "modules/CastEvents";
import { loadPlaces } from "requests/places";

type EventProcessingFormKey = keyof EventProcessingForm;

interface InputFieldProps {
    fieldName: EventProcessingFormKey;
    value: string | undefined;
    title: string;
    type: "text" | "date" | "time";
    requered?: boolean;
    changeHandler: (event: Event, fieldName: EventProcessingFormKey) => void;
}

const InputField = ({ fieldName, value, title, type, requered, changeHandler }: InputFieldProps) => {
    return (
        <div className="event-processing__form-block">
            <label htmlFor={`event-processing-${fieldName}`} className="form-label">
                {title}
            </label>
            <input
                name={fieldName}
                className="form-control"
                type={type}
                id={`event-processing-${fieldName}`}
                value={value}
                onChange={(e) => changeHandler(toEvent(e), fieldName)}
                required={requered ? true : false}
            />
        </div>
    );
};

export interface EventProcessingProps {
    type: EventProcessingState.Type;
}

export class EventProcessing extends Component<EventProcessingProps> {
    constructor(props: EventProcessingProps) {
        super(props);

        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleChangeImg = this.handleChangeImg.bind(this);
    }

    #isEdit(): boolean {
        const { processing } = store.state.events;
        if (processing.loadStatus === LoadStatus.DONE) {
            return processing.processingState === EventProcessingState.EDIT;
        }
        return false;
    }

    setCreate() {
        store.dispatch(setEventProcessingLoadStart());
        requestManager.request(loadEventProcessingCreate);
    }

    setEdit() {
        store.dispatch(setEventProcessingLoadStart());
        const eventId = parseInt(router.getNextUrl().slice(1));
        requestManager.request(loadEventProcessingEdit, eventId);
    }

    didCreate() {
        requestManager.request(loadPlaces);
        if (this.props.type === EventProcessingState.CREATE) {
            this.setCreate();
        } else {
            this.setEdit();
        }
    }

    handleRemove() {
        const { processing } = store.state.events;
        if (processing.loadStatus !== LoadStatus.DONE) {
            return;
        }

        ajax.delete({ url: `/events/${processing.formData.id}`, credentials: true })
            .then(({ status }) => {
                if (status === AjaxResultStatus.SUCCESS) {
                    router.go("/");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleChangeField(event: Event, filedName: keyof EventProcessingForm) {
        console.log("handleChangeName");
        const { processing } = store.state.events;
        if (processing.loadStatus !== LoadStatus.DONE) {
            return;
        }
        const target = event.target as HTMLInputElement;

        store.dispatch(setEventProcessingFormDataField({ field: filedName, value: target.value }));
    }

    handleChangeImg(event: Event) {
        const { processing } = store.state.events;
        if (processing.loadStatus !== LoadStatus.DONE) {
            return;
        }
        const target = event.target as HTMLInputElement;

        const files = target.files;
        if (files && files.length > 0) {
            store.dispatch(setEventProcessingFormImg(URL.createObjectURL(files[0])));
        }
    }

    handleChangePlace(placeId: number) {
        store.dispatch(setEventProcessingFormDataField({ field: "place", value: placeId }));
    }

    handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        const { processing } = store.state.events;
        if (processing.loadStatus !== LoadStatus.DONE || store.state.places.places.loadStatus !== LoadStatus.DONE) {
            return;
        }
        if (processing.formData.place === -1) {
            store.dispatch(setEventProcessingErrorMsg("Не выбрано место"));
            return;
        }
        const place = store.state.places.places.data.find((value) => value.id === processing.formData.place);
        if (!place) {
            return;
        }

        const form = event.target as HTMLFormElement;

        let formData = new FormData(form);

        const dateStart = formData.get("dateStart") as string;
        const dateEnd = formData.get("dateEnd") as string;

        if (dateStart) {
            formData.set("dateStart", dateToServer(dateStart) || "");
        }
        if (dateEnd) {
            formData.set("dateEnd", dateToServer(dateEnd) || "");
        }
        formData.set(
            "tags",
            Object.entries(processing.tags.tags)
                .filter(([_, value]) => value.selected)
                .map(([key, _]) => key)
                .join(",")
        );

        const sendForm = (data: FormData) => {
            formData.set("place", place.name);

            console.group("EventProcessing FormData");
            for (const i of data) console.log(i);
            console.groupEnd();

            const isCreate = !this.#isEdit();
            const ajaxMethod = isCreate ? ajax.post.bind(ajax) : ajax.patch.bind(ajax);
            const url: string = "/events" + (!isCreate ? `/${processing.formData.id}` : "");

            ajax.removeHeaders("Content-Type");
            ajaxMethod({ url: url, credentials: true, body: data })
                .then(({ json, status }) => {
                    if (status === AjaxResultStatus.SUCCESS) {
                        router.go("/");
                    } else {
                        store.dispatch(setEventProcessingErrorMsg(json.errorMsg));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });
        };

        if (processing.tempFileUrl !== undefined) {
            toWebP(processing.tempFileUrl, (imageBlob: Blob) => {
                formData.set("file", imageBlob);
                sendForm(formData);
            });
        } else {
            sendForm(formData);
        }
    }

    render() {
        if (kickUnauthorized(store.state.user)) {
            return <div></div>;
        }

        const { processing } = store.state.events;
        if (processing.loadStatus === LoadStatus.DONE) {
            const { formData } = processing;
            const places =
                store.state.places.places.loadStatus === LoadStatus.DONE ? store.state.places.places.data : [];
            const isEdit = this.props.type === EventProcessingState.EDIT;
            const hasImg = formData.img !== "" || processing.tempFileUrl;
            const imgUrl = formData.img || processing.tempFileUrl || "";

            return (
                <div className="event-processing">
                    <form
                        className="form event-processing__form"
                        id="event-processing-form"
                        onSubmit={(e) => this.handleSubmit(toSubmitEvent(e))}
                    >
                        <InputField
                            fieldName="name"
                            title="Название мероприятия:"
                            type="text"
                            value={formData.name}
                            changeHandler={this.handleChangeField}
                            requered={true}
                        />

                        {/* <label htmlFor="event-processing-teaser" className="form-label">
                            Тизер:
                        </label>
                        <textarea
                            name="teaser"
                            className="form-control event-processing__form-textarea"
                            id="event-processing-teaser"
                        >
                            {formData.description}
                        </textarea> */}
                        <div className="event-processing__form-block">
                            <label htmlFor="event-processing-description" className="form-label">
                                Полное описание:
                            </label>
                            <textarea
                                name="description"
                                className="form-control event-processing__form-textarea"
                                id="event-processing-description"
                                required
                                onChange={(e) => this.handleChangeField(toEvent(e), "description")}
                            >
                                {formData.description}
                            </textarea>
                        </div>

                        <InputField
                            fieldName="dateStart"
                            title="Дата начала:"
                            type="date"
                            value={formData.dateStart}
                            changeHandler={this.handleChangeField}
                        />
                        <InputField
                            fieldName="timeStart"
                            title="Время начала:"
                            type="time"
                            value={formData.timeStart}
                            changeHandler={this.handleChangeField}
                        />
                        <InputField
                            fieldName="dateEnd"
                            title="Дата конца:"
                            type="date"
                            value={formData.dateEnd}
                            changeHandler={this.handleChangeField}
                        />
                        <InputField
                            fieldName="timeEnd"
                            title="Время конца:"
                            type="time"
                            value={formData.timeEnd}
                            changeHandler={this.handleChangeField}
                        />

                        <div className="event-processing__tags">
                            <Tags
                                tagsState={processing.tags}
                                toggleTag={({ tag }: ToggleTagFuncProps) => {
                                    store.dispatch(toggleEventProcessingTag(tag));
                                }}
                            />
                        </div>

                        <div className="event-processing__form-block">
                            <label htmlFor="event-processing-place" className="form-label">
                                Место проведения:
                            </label>
                            <select
                                name="place"
                                className="form-control"
                                id="event-processing-place"
                                placeholder="Выберите место проведения..."
                                onChange={(e) => this.handleChangePlace(parseInt(e.target.value))}
                            >
                                <option selected={formData.place === -1} disabled value={-1}>
                                    Выберите место проведения...
                                </option>
                                {places.map((place) => (
                                    <option selected={formData.place === place.id} value={place.id}>
                                        {place.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="event-processing__form-block">
                            {hasImg ? (
                                <label htmlFor="event-processing-img" className="form-label">
                                    <img className="event-processing__img-prev" src={imgUrl} alt="Картинка :3" />
                                </label>
                            ) : (
                                <label htmlFor="event-processing-img" className="form-label">
                                    Картинка:
                                </label>
                            )}
                            <input
                                id="event-processing-img"
                                name="file"
                                className={`form-control ${hasImg ? "invisible" : ""}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => this.handleChangeImg(toEvent(e))}
                            />
                        </div>

                        <div className="event-processing__form-block">{processing.errorMsg}</div>

                        <div className="event-processing__button-block">
                            <input
                                className="button form-submit"
                                id="event-processing-submit"
                                type="submit"
                                value={isEdit ? "Сохранить изменения" : "Создать"}
                            />
                            {isEdit ? (
                                <input
                                    className="button-danger form-submit"
                                    id="event-processing-remove"
                                    type="button"
                                    value="Удалить"
                                    onClick={this.handleRemove}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </form>
                </div>
            );
        } else if (processing.loadStatus === LoadStatus.ERROR) {
            return <div>Error!!!</div>;
        }

        return <div>Loadig . . .</div>;
    }
}
