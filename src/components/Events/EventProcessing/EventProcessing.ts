import { Component } from "components/Component";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { router } from "modules/router";
import EventCreateTemplate from "templates/Events/EventProcessing/EventProcessing.handlebars";
import { toWebP } from "modules/imgConverter";
import { store } from "flux";
import { kickUnauthorized } from "flux/slices/userSlice";
import { LoadStatus } from "requests/LoadStatus";
import "./styles.scss";
import { Tags, ToggleTagFuncProps } from "components/Tags/Tags";
import { EventProcessingForm, EventProcessingState } from "models/Events";
import { setEventProcessingLoadStart, toggleEventProcessingTag } from "flux/slices/eventSlice";
import { requestManager } from "requests";
import { loadEventProcessingCreate, loadEventProcessingEdit } from "requests/events";
import { dateToServer } from "modules/dateParser";

export class EventProcessing extends Component {
    #tagsComponent: Tags;

    constructor(parent: Component) {
        super(parent);

        this.#tagsComponent = this.createComponent(
            Tags,
            "js-event-processing-tag",
            () => {
                const { processing } = store.getState().events;
                return processing.loadStatus === LoadStatus.DONE ? processing.tags.tags : {};
            },
            ({ tag }: ToggleTagFuncProps) => {
                store.dispatch(toggleEventProcessingTag(tag));
            }
        );

        this.registerEvent(
            () => document.getElementById("event-processing-form"),
            "submit",
            this.#handleSubmit.bind(this)
        );
        this.registerEvent(
            () => document.getElementById("event-processing-form"),
            "change",
            this.#handleChange.bind(this)
        );
        this.registerEvent(
            () => document.getElementById("event-processing-remove"),
            "click",
            this.#handleRemove.bind(this)
        );
    }

    #isEdit(): boolean {
        const { processing } = store.getState().events;
        if (processing.loadStatus === LoadStatus.DONE) {
            return processing.processingState === EventProcessingState.EDIT;
        }
        return false;
    }

    createDefaultData(): EventProcessingForm {
        return {
            id: -1,
            name: "",
            description: "",
            place: "",
            dateStart: "",
            dateEnd: "",
            timeStart: "",
            timeEnd: "",
            img: "",
        };
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

    #handleChange(event: Event) {
        const { processing } = store.getState().events;
        if (processing.loadStatus !== LoadStatus.DONE) {
            return;
        }

        const target = event.target as HTMLInputElement;
        if (target.name === "file") {
            const files = target.files;
            if (files && files.length > 0) {
                processing.tempFileUrl = URL.createObjectURL(files[0]);
                this.rerender();
            }
        } else {
            const name: keyof EventProcessingForm = target.name as keyof EventProcessingForm;
            (processing.formData[name] as string) = target.value;
        }
    }

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

    render() {
        if (kickUnauthorized(store.getState().user)) {
            return "";
        }

        const { processing } = store.getState().events;
        if (processing.loadStatus === LoadStatus.DONE) {
            const { formData } = processing;

            return EventCreateTemplate({
                ...formData,
                isEdit: this.#isEdit(),
                img: processing.tempFileUrl || formData.img,
                hasImg: processing.tempFileUrl !== undefined || formData.img,
                tags: this.#tagsComponent.render(),
            });
        } else if (processing.loadStatus === LoadStatus.ERROR) {
            return "Error!!!";
        }

        return "Loadig . . .";
    }
}
