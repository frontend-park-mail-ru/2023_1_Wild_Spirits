import { VDOM, Component } from "modules/vdom";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { router } from "modules/router";
import { toWebP } from "modules/imgConverter";
import { store } from "flux";
import { kickUnauthorized } from "flux/slices/userSlice";
import { LoadStatus } from "requests/LoadStatus";
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
import { Loading } from "components/Common/Loading";
import { InputFieldType } from "components/Form/FormBase";
import { EPFormFieldBase, EPFormFieldNames, EPInputField, EPTextareaField } from "./FormFields";

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
            .catch(() => {
                store.dispatch(
                    setEventProcessingErrors({ default: "По каким-то причинам, удалить мероприятие сейчас невозможно" })
                );
            });
    }

    handleChangeField(event: Event, fieldName: EPFormFieldNames) {
        const { processing } = store.state.events;
        if (processing.loadStatus !== LoadStatus.DONE) {
            return;
        }
        const target = event.target as HTMLInputElement;

        store.dispatch(setEventProcessingFormDataField({ field: fieldName, value: target.value }));
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

    handleChangePlace(place: string) {
        store.dispatch(setEventProcessingFormDataField({ field: "place", value: place }));
    }

    handleChangeCategory(category: string) {
        store.dispatch(setEventProcessingFormDataField({ field: "category", value: category }));
    }

    validateFormData(): { eventId: number; formData: FormData; tempFileUrl?: string } | undefined {
        const { processing } = store.state.events;
        if (processing.loadStatus !== LoadStatus.DONE || store.state.places.places.loadStatus !== LoadStatus.DONE) {
            return;
        }
        const formData = new FormData();
        const errors: EventProcessingErrorsType = {};

        processing.formData.name === ""
            ? (errors.name = "Забыли указать название")
            : formData.set("name", processing.formData.name);

        processing.formData.description === ""
            ? (errors.description = "Нет подробного описания")
            : formData.set("description", processing.formData.description);

        if (processing.formData.place === "") {
            errors.place = "Не выбрано место";
        } else {
            formData.set("place", processing.formData.place);
        }

        if (processing.formData.category !== "") {
            formData.set("categories", processing.formData.category);
        }

        const dateStart = dateToServer(processing.formData.dateStart);
        dateStart ? formData.set("dateStart", dateStart) : (errors.dateStart = "Место начала обязательно");

        const timeStart = processing.formData.timeStart;
        timeStart ? formData.set("timeStart", timeStart) : (errors.timeStart = "Время начала обязательно");

        formData.set("dateEnd", dateToServer(processing.formData.dateEnd) || "");
        formData.set("timeEnd", processing.formData.timeEnd || "");

        formData.set(
            "tags",
            Object.entries(processing.tags)
                .filter(([_, value]) => value.selected)
                .map(([key, _]) => key)
                .join(",")
        );

        if (!(processing.formData.img || processing.tempFileUrl)) {
            errors.img = "Добавьте картинку";
        }

        if (Object.keys(errors).length > 0) {
            store.dispatch(setEventProcessingErrors(errors));
            return;
        }
        return {
            eventId: processing.formData.id,
            formData,
            tempFileUrl: processing.tempFileUrl,
        };
    }

    handleSubmit(event: SubmitEvent) {
        event.preventDefault();

        const result = this.validateFormData();
        if (!result) {
            return;
        }
        const { eventId, formData, tempFileUrl } = result;

        const sendForm = (data: FormData) => {
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
                .catch(() => {
                    store.dispatch(setEventProcessingErrors({ default: "Ошибка сервера, попробуйте позже!" }));
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
        required = false,
        min?: string
    ) {
        const { formData, errors } = store.state.events.processing as EventProcessingData;

        return {
            prefix: "event-processing",
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
        if (processing.loadStatus === LoadStatus.ERROR) {
            return <div>Error!!!</div>;
        }

        if (processing.loadStatus !== LoadStatus.DONE) {
            return (
                <div className="laoding-page-container">
                    <Loading size="xxl" />
                </div>
            );
        }

        const { formData } = processing;
        const places = store.state.places.places.loadStatus === LoadStatus.DONE ? store.state.places.places.data : [];
        const categories = store.state.header.categories;
        const isEdit = this.props.type === EventProcessingType.EDIT;
        const hasImg = formData.img !== "" || processing.tempFileUrl;
        const imgUrl = processing.tempFileUrl || formData.img || "";

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
                    <EPInputField {...this.getFieldData("name", "Название мероприятия", "text", true)} />

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

                    <EPTextareaField
                        prefix="event-processing"
                        fieldName="description"
                        title="Полное описание"
                        value={formData.description}
                        changeHandler={this.handleChangeField}
                        required={true}
                        errorMsg={processing.errors.description}
                    />

                    <EPInputField {...this.getFieldData("dateStart", "Дата начала", "date", true, "2023-01-01")} />
                    <EPInputField {...this.getFieldData("timeStart", "Время начала", "time", true)} />
                    <EPInputField {...this.getFieldData("dateEnd", "Дата конца", "date", false, "2023-01-01")} />
                    <EPInputField {...this.getFieldData("timeEnd", "Время конца", "time")} />

                    <div className="event-processing__tags">
                        <Tags
                            tagsState={{ tags: processing.tags }}
                            toggleTag={({ tag }: ToggleTagFuncProps) => {
                                store.dispatch(toggleEventProcessingTag(tag));
                            }}
                        />
                    </div>

                    <EPFormFieldBase
                        prefix="event-processing"
                        fieldName="category"
                        title="Категория"
                        errorMsg={processing.errors.category}
                    >
                        <select
                            name="category"
                            className="form-control"
                            id="event-processing-category"
                            placeholder="Выберите категорию..."
                            onChange={(e) => this.handleChangeCategory(e.target.value)}
                        >
                            <option selected={formData.category === ""} value="">
                                Нет категории
                            </option>
                            {categories.map(({ name }) => (
                                <option selected={formData.category === name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </EPFormFieldBase>

                    <EPFormFieldBase
                        prefix="event-processing"
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
                            onChange={(e) => this.handleChangePlace(e.target.value)}
                        >
                            <option selected={formData.place === ""} disabled value={""}>
                                Выберите место проведения...
                            </option>
                            {places.map((place) => (
                                <option selected={formData.place === place.name} value={place.name}>
                                    {place.name}
                                </option>
                            ))}
                        </select>
                    </EPFormFieldBase>

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
                            className="button"
                            id="event-processing-submit"
                            type="submit"
                            value={isEdit ? "Сохранить изменения" : "Создать"}
                        />
                        {isEdit && (
                            <input
                                className="button-danger"
                                id="event-processing-remove"
                                type="button"
                                value="Удалить"
                                onClick={this.handleRemove}
                            />
                        )}
                    </div>
                </form>
            </div>
        );
    }
}
