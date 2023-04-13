import { Component } from "components/Component";
import config from "config";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { router } from "modules/router";
import { ResponseEvent } from "responses/ResponseEvent";
import EventCreateTemplate from "templates/Events/EventProcessing/EventProcessing.handlebars";
import { toWebP } from "modules/imgConverter";
import { store } from "flux";
import { LoadStatus } from "requests/LoadStatus";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";

interface EventBody {
    name: string;
    desc: string;
    places: number[];
    categories: number[];
    tags: number[];
    dates: { dateStart?: string; dateEnd?: string; timeStart?: string; timeEnd?: string; weakdays: number[] };
}

interface EventProcessingForm {
    id: number;
    name: string;
    description: string;
    dateStart?: string;
    dateEnd?: string;
    timeStart?: string;
    timeEnd?: string;
    place: string;
    img: string;
}

namespace ProcessingState {
    export const CREATE = "CREATE";
    export const EDIT = "EDIT";
    export type Type = typeof CREATE | typeof EDIT;
}

export class EventProcessing extends Component {
    #processingState: ProcessingState.Type = ProcessingState.CREATE;
    #editData: EventProcessingForm;

    #tempFileUrl: string | undefined = undefined;

    constructor(parent: Component) {
        super(parent);

        this.#editData = this.createDefaultData();

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

    postRender() {}

    createDefaultData(): EventProcessingForm {
        return {
            id: -1,
            name: "TName",
            description: "TDesc",
            place: "ВДНХ",
            dateStart: "2023-01-01",
            dateEnd: "2023-03-03",
            timeStart: "10:00",
            timeEnd: "19:00",
            img: "",
        };
    }

    setCreate() {
        this.#editData = this.createDefaultData();
        this.#processingState = ProcessingState.CREATE;
    }

    setEdit() {
        const eventId = parseInt(router.getNextUrl().slice(1));
        ajax.get<ResponseEvent>({ url: `/events/${eventId}` })
            .then(({ json, response, status }) => {
                if (status === AjaxResultStatus.SUCCESS) {
                    const event = json.body.event;
                    this.#editData = {
                        id: event.id,
                        name: event.name,
                        description: event.description,
                        dateStart: this.encodeDate(event.dates.dateStart),
                        dateEnd: this.encodeDate(event.dates.dateEnd),
                        timeStart: event.dates.timeStart,
                        timeEnd: event.dates.timeEnd,
                        place: "ВДНХ",
                        img: getUploadsImg(event.img),
                    };
                    this.rerender();
                }
            })
            .catch((error) => {
                console.log(error);
            });

        this.#processingState = ProcessingState.EDIT;
    }

    decodeDate(date: string): string {
        let splt = date.split("-");
        [splt[0], splt[2]] = [splt[2], splt[0]];
        return splt.join(".");
    }
    encodeDate(date: string | undefined): string | undefined {
        if (date === undefined) {
            return undefined;
        }
        try {
            let splt = date.split(".");
            [splt[0], splt[2]] = [splt[2], splt[0]];
            return splt.join("-");
        } catch {
            return undefined;
        }
    }

    #handleSubmit(event: SubmitEvent) {
        event.preventDefault();

        const form = event.target as HTMLFormElement;

        let formData = new FormData(form);

        const dateStart = formData.get("dateStart") as string;
        const dateEnd = formData.get("dateEnd") as string;

        if (dateStart) {
            formData.set("dateStart", this.decodeDate(dateStart));
        }
        if (dateEnd) {
            formData.set("dateEnd", this.decodeDate(dateEnd));
        }

        const sendForm = (data: FormData) => {
            for (const i of formData) console.log(i);
            const isCreate = this.#processingState === ProcessingState.CREATE;
            let ajaxMethod = isCreate ? ajax.post.bind(ajax) : ajax.patch.bind(ajax);

            ajax.removeHeaders("Content-Type");
            const url: string = "/events" + (!isCreate && this.#editData !== undefined ? `/${this.#editData.id}` : "");

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

        if (this.#tempFileUrl !== undefined) {
            console.log("this.#tempFileUrl !== undefined");
            toWebP(this.#tempFileUrl, (imageBlob: Blob) => {
                formData.set("file", imageBlob);
                console.log("webp");
                sendForm(formData);
            });
        } else {
            sendForm(formData);
        }
    }

    #handleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.name === "file") {
            const files = target.files;
            if (files && files.length > 0) {
                this.#tempFileUrl = URL.createObjectURL(files[0]);
                this.rerender();
            }
        } else {
            const name: keyof EventProcessingForm = target.name as keyof EventProcessingForm;
            (this.#editData[name] as string) = target.value;
        }
    }

    #handleRemove(event: Event) {
        if (this.#editData) {
            ajax.delete({ url: `/events/${this.#editData.id}`, credentials: true })
                .then(({ status }) => {
                    if (status === AjaxResultStatus.SUCCESS) {
                        router.go("/");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    render() {
        const userState = store.getState().user;
        if (
            (userState.authorizedLoadStatus === LoadStatus.DONE ||
                userState.authorizedLoadStatus === LoadStatus.ERROR) &&
            userState.data === undefined
        ) {
            router.go("/");
            return "";
        }
        const isEdit: boolean = this.#processingState === ProcessingState.EDIT;
        return EventCreateTemplate({
            ...this.#editData,
            isEdit,
            img: this.#tempFileUrl || this.#editData.img,
            hasImg: this.#tempFileUrl !== undefined || this.#editData.img,
        });
    }
}
