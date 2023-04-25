import { createVNode, Component } from "modules/vdom";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { router } from "modules/router";
import EventCreateTemplate from "templates/Events/EventProcessing/EventProcessing.handlebars";
import { toWebP } from "modules/imgConverter";
import { store } from "flux";
import { kickUnauthorized } from "flux/slices/userSlice";
import { LoadStatus } from "requests/LoadStatus";
import "./styles.scss";
import { EventProcessingForm, EventProcessingState } from "models/Events";
import {
    setEventProcessingFormDataField,
    setEventProcessingFormImg,
    setEventProcessingLoadStart,
    toggleEventProcessingTag,
} from "flux/slices/eventSlice";
import { requestManager } from "requests";
import { loadEventProcessingCreate, loadEventProcessingEdit } from "requests/events";
import { dateToServer } from "modules/dateParser";

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
                onChange={(e) => changeHandler(e as unknown as Event, fieldName)}
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
        const { processing } = store.getState().events;
        if (processing.loadStatus === LoadStatus.DONE) {
            return processing.processingState === EventProcessingState.EDIT;
        }
        return false;
    }

    setCreate() {
        if (!router.isUrlChanged()) {
            return;
        }

        requestManager.request(loadEventProcessingCreate);
    }

    setEdit() {
        if (!router.isUrlChanged()) {
            return;
        }

        store.dispatch(setEventProcessingLoadStart());
        const eventId = parseInt(router.getNextUrl().slice(1));
        requestManager.request(loadEventProcessingEdit, eventId);
    }

    didCreate() {
        this.setCreate();
    }

    #handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        const { processing } = store.getState().events;
        if (processing.loadStatus !== LoadStatus.DONE) {
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
            const isCreate = !this.#isEdit();
            const ajaxMethod = isCreate ? ajax.post.bind(ajax) : ajax.patch.bind(ajax);
            const url: string = "/events" + (!isCreate ? `/${processing.formData.id}` : "");

            ajax.removeHeaders("Content-Type");
            ajaxMethod({ url: url, credentials: true, body: data })
                .then(({ status }) => {
                    if (status === AjaxResultStatus.SUCCESS) {
                        router.go("/");
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

    // #handleChange(event: Event) {
    //     const { processing } = store.getState().events;
    //     if (processing.loadStatus !== LoadStatus.DONE) {
    //         return;
    //     }

    //     const target = event.target as HTMLInputElement;
    //     if (target.name === "file") {
    //         const files = target.files;
    //         if (files && files.length > 0) {
    //             processing.tempFileUrl = URL.createObjectURL(files[0]);
    //         }
    //     } else {
    //         const name: keyof EventProcessingForm = target.name as keyof EventProcessingForm;
    //         (processing.formData[name] as string) = target.value;
    //     }
    // }

    #handleRemove(event: Event) {
        const { processing } = store.getState().events;
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
        const { processing } = store.getState().events;
        if (processing.loadStatus !== LoadStatus.DONE) {
            return;
        }
        const target = event.target as HTMLInputElement;

        store.dispatch(setEventProcessingFormDataField({ field: filedName, value: target.value }));
    }

    handleChangeImg(event: Event) {
        const { processing } = store.getState().events;
        if (processing.loadStatus !== LoadStatus.DONE) {
            return;
        }
        const target = event.target as HTMLInputElement;

        const files = target.files;
        if (files && files.length > 0) {
            store.dispatch(setEventProcessingFormImg(URL.createObjectURL(files[0])));
        }
    }

    handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        const { processing } = store.getState().events;
        if (processing.loadStatus !== LoadStatus.DONE) {
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
            const isCreate = !this.#isEdit();
            const ajaxMethod = isCreate ? ajax.post.bind(ajax) : ajax.patch.bind(ajax);
            const url: string = "/events" + (!isCreate ? `/${processing.formData.id}` : "");

            ajax.removeHeaders("Content-Type");
            ajaxMethod({ url: url, credentials: true, body: data })
                .then(({ status }) => {
                    if (status === AjaxResultStatus.SUCCESS) {
                        router.go("/");
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
        if (kickUnauthorized(store.getState().user)) {
            return <div></div>;
        }

        const { processing } = store.getState().events;
        if (processing.loadStatus === LoadStatus.DONE) {
            const { formData } = processing;
            const isEdit = this.props.type === EventProcessingState.EDIT;
            const hasImg = formData.img !== "" || processing.tempFileUrl;
            const imgUrl = formData.img || processing.tempFileUrl || "";
            console.log(formData);

            return (
                <div className="event-processing">
                    <form
                        className="form event-processing__form"
                        id="event-processing-form"
                        onSubmit={(e) => this.handleSubmit(e as unknown as SubmitEvent)}
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
                                onChange={(e) => this.handleChangeField(e as unknown as Event, "description")}
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

                        {/* <div className="event-processing__tags">
                            {tags}
                        </div> */}
                        <div className="event-processing__form-block">
                            <label htmlFor="event-processing-place" className="form-label">
                                Место проведения:
                            </label>
                            <input
                                name="place"
                                className="form-control"
                                id="event-processing-place"
                                list="test"
                                placeholder="Выберите место проведения..."
                                value={formData.place}
                                required
                            />
                            <datalist id="test">
                                <option value="ВДНХ"></option>
                                <option value="Битца"></option>
                                <option value="Большой театр"></option>
                                <option value="Третьяковская галерея"></option>
                            </datalist>
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
                                onChange={(e) => this.handleChangeImg(e as unknown as Event)}
                            />
                        </div>

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
