import { VDOM, Component } from "modules/vdom";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { router } from "modules/router";
import { toWebP } from "modules/imgConverter";
import { store } from "flux";
import { kickUnauthorized } from "flux/slices/userSlice";
import { LoadStatus } from "requests/LoadStatus";
import "./styles.scss";
import { EventProcessingForm, EventProcessingType } from "models/Events";
import {
    EventProcessingData,
    EventProcessingErrorsType,
    setEventProcessingErrors,
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
import { FormFieldBase, InputField, InputFieldType, TextareaField } from "./FormFields";

export interface EventProcessingProps {
    type: EventProcessingType.Type;
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
            return processing.processingState === EventProcessingType.EDIT;
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
        if (this.props.type === EventProcessingType.CREATE) {
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

    validateFormData(): { eventId: number; formData: FormData; tempFileUrl?: string } | undefined {
        const { processing } = store.state.events;
        if (processing.loadStatus !== LoadStatus.DONE || store.state.places.places.loadStatus !== LoadStatus.DONE) {
            return;
        }
        const formData = new FormData();
        let errors: EventProcessingErrorsType = {};

        processing.formData.name === ""
            ? (errors.name = "Забыли указать название")
            : formData.set("name", processing.formData.name);

        // processing.formData.teaser === ""
        //     ? (errors.teaser = "Нет краткого описания")
        //     : formData.set("teaser", processing.formData.teaser);

        processing.formData.description === ""
            ? (errors.description = "Нет подробного описания")
            : formData.set("description", processing.formData.description);

        if (processing.formData.place === -1) {
            errors.place = "Не выбрано место";
        } else {
            const place = store.state.places.places.data.find((value) => value.id === processing.formData.place);
            place ? formData.set("place", place.name) : (errors.place = "Место не найдено, попробуйте выбрать другое");
        }

        const dateStart = dateToServer(processing.formData.dateStart);
        dateStart ? formData.set("dateStart", dateStart) : (errors.dateStart = "Место начала обязательно");

        const timeStart = processing.formData.timeStart;
        timeStart ? formData.set("timeStart", timeStart) : (errors.timeStart = "Время начала обязательно");

        formData.set("dateEnd", dateToServer(processing.formData.dateEnd) || "");
        formData.set("timeEnd", processing.formData.timeEnd || "");

        formData.set(
            "tags",
            Object.entries(processing.tags.tags)
                .filter(([_, value]) => value.selected)
                .map(([key, _]) => key)
                .join(",")
        );

        console.log(processing.formData.img || processing.tempFileUrl);

        if (!(processing.formData.img || processing.tempFileUrl)) {
            errors.img = "Добавьте картинку";
        }

        if (Object.keys(errors).length > 0) {
            store.dispatch(setEventProcessingErrors(errors));
            return;
        }
        for (const i of formData.entries()) console.log(i[0], i[1]);
        return {
            eventId: processing.formData.id,
            formData,
            tempFileUrl: processing.tempFileUrl,
        };
        // return new FormData();
    }

    handleSubmit(event: SubmitEvent) {
        event.preventDefault();

        const result = this.validateFormData();
        if (!result) {
            return;
        }
        const { eventId, formData, tempFileUrl } = result;

        const sendForm = (data: FormData) => {
            console.group("EventProcessing FormData");
            for (const i of data) console.log(i);
            console.groupEnd();

            const isCreate = !this.#isEdit();
            const ajaxMethod = isCreate ? ajax.post.bind(ajax) : ajax.patch.bind(ajax);
            const url: string = "/events" + (!isCreate ? `/${eventId}` : "");

            ajax.removeHeaders("Content-Type");
            ajaxMethod({ url: url, credentials: true, body: data })
                .then(({ json, status }) => {
                    if (status === AjaxResultStatus.SUCCESS) {
                        router.go("/");
                    } else {
                        store.dispatch(setEventProcessingErrors({ default: json.errorMsg }));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });
        };

        if (tempFileUrl !== undefined) {
            toWebP(tempFileUrl, (imageBlob: Blob) => {
                formData.set("file", imageBlob);
                sendForm(formData);
            });
        } else {
            sendForm(formData);
        }
    }

    getFieldData(
        fieldName: keyof EventProcessingForm,
        title: string,
        type: InputFieldType,
        required: boolean = false,
        min?: string
    ) {
        const { formData, errors } = store.state.events.processing as EventProcessingData;

        return {
            fieldName,
            title,
            type,
            required,
            min,
            value: formData[fieldName],
            errorMsg: errors[fieldName],
            changeHandler: this.handleChangeField,
        };
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
            const isEdit = this.props.type === EventProcessingType.EDIT;
            const hasImg = formData.img !== "" || processing.tempFileUrl;
            const imgUrl = processing.tempFileUrl || formData.img || "";
            console.log(formData.img, processing.tempFileUrl);

            return (
                <div className="event-processing">
                    {/* <div className="form-required-title">
                        <span className="form-label-required"></span> - Обязательные поля
                    </div> */}
                    <form
                        className="form event-processing__form"
                        id="event-processing-form"
                        onSubmit={(e) => this.handleSubmit(toSubmitEvent(e))}
                    >
                        <InputField {...this.getFieldData("name", "Название мероприятия", "text", true)} />

                        {/* <label htmlFor="event-processing-teaser" className="form-label">
                            Тизер
                        </label>
                        <textarea
                            name="teaser"
                            className="form-control event-processing__form-textarea"
                            id="event-processing-teaser"
                        >
                            {formData.description}
                        </textarea> */}

                        <TextareaField
                            fieldName="description"
                            title="Полное описание"
                            value={formData.description}
                            changeHandler={this.handleChangeField}
                            required={true}
                            errorMsg={processing.errors.description}
                        />

                        <InputField {...this.getFieldData("dateStart", "Дата начала", "date", true, "2023-01-01")} />
                        <InputField {...this.getFieldData("timeStart", "Время начала", "time", true)} />
                        <InputField {...this.getFieldData("dateEnd", "Дата конца", "date", false, "2023-01-01")} />
                        <InputField {...this.getFieldData("timeEnd", "Время конца", "time")} />

                        <div className="event-processing__tags">
                            <Tags
                                tagsState={processing.tags}
                                toggleTag={({ tag }: ToggleTagFuncProps) => {
                                    store.dispatch(toggleEventProcessingTag(tag));
                                }}
                            />
                        </div>

                        <FormFieldBase
                            fieldName="place"
                            title="Место проведения"
                            required={true}
                            errorMsg={processing.errors.place}
                        >
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
                        </FormFieldBase>

                        <div className="event-processing__form-block">
                            {hasImg ? (
                                <label
                                    htmlFor="event-processing-img"
                                    className="form-label-img-editable event-processing__img-label"
                                >
                                    <img
                                        className="event-processing__img-prev form-img-editable"
                                        src={imgUrl}
                                        alt="Картинка :3"
                                    />
                                </label>
                            ) : (
                                <label htmlFor="event-processing-img" className="form-label-required">
                                    Картинка
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

                            {processing.errors.img && <div className="form-error">{processing.errors.img}</div>}
                        </div>

                        <div className="form-error">{processing.errors.default}</div>

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
