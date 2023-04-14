import { Component } from "components/Component";
import { AjaxResultStatus, ajax } from "modules/ajax";
import { router } from "modules/router";
import { ResponseEvent } from "responses/ResponseEvent";
import EventCreateTemplate from "templates/Events/EventProcessing/EventProcessing.handlebars";
import { toWebP } from "modules/imgConverter";
import { store } from "flux";
import { kickUnauthorized } from "flux/slices/userSlice";
import { LoadStatus } from "requests/LoadStatus";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { Tags, ToggleTagFuncProps } from "components/Tags/Tags";
import { TagsState } from "flux/slices/tagsSlice";

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
    tags: string[] | null;
}

namespace ProcessingState {
    export const CREATE = "CREATE";
    export const EDIT = "EDIT";
    export type Type = typeof CREATE | typeof EDIT;
}

export class EventProcessing extends Component {
    #processingState: ProcessingState.Type = ProcessingState.CREATE;
    #editData: EventProcessingForm;
    #tagsComponent: Tags;
    #loadStatus: LoadStatus.Type = LoadStatus.NONE;

    #tempFileUrl: string | undefined = undefined;

    #tags: TagsState = { tags: {} };

    constructor(parent: Component) {
        super(parent);

        this.#editData = this.createDefaultData();

        this.#tagsComponent = this.createComponent(
            Tags,
            "js-event-processing-tag",
            () => this.#tags.tags,
            ({ tag }: ToggleTagFuncProps) => {
                if (this.#tags.tags[tag] === undefined) {
                    return;
                }
                this.#tags.tags[tag].selected = !this.#tags.tags[tag].selected;
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
        return this.#processingState === ProcessingState.EDIT;
    }
    postRender() {}

    createDefaultData(): EventProcessingForm {
        return {
            id: -1,
            name: "TName",
            description: "TDesc",
            place: "ВДНХ",
            dateStart: "2023-05-01",
            dateEnd: "2023-11-03",
            timeStart: "10:00",
            timeEnd: "19:00",
            img: "",
            tags: [],
        };
    }

    setCreate() {
        this.#editData = this.createDefaultData();
        this.#tags.tags = {};
        this.#processingState = ProcessingState.CREATE;
        this.#loadStatus = LoadStatus.DONE;
    }

    setEdit() {
        this.#tags.tags = {};

        const eventId = parseInt(router.getNextUrl().slice(1));
        this.#loadStatus = LoadStatus.LOADING;
        ajax.get<ResponseEvent>({ url: `/events/${eventId}` })
            .then(({ json, status }) => {
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
                        tags: event.tags,
                        img: getUploadsImg(event.img),
                    };
                    this.#loadStatus = LoadStatus.DONE;
                    this.rerender();
                } else {
                    this.#loadStatus = LoadStatus.ERROR;
                }
            })
            .catch((error) => {
                this.#loadStatus = LoadStatus.ERROR;
                console.log(error);
            });

        this.#processingState = ProcessingState.EDIT;
    }

    #setTags() {
        this.#tags.tags = Object.fromEntries(
            Object.entries(store.getState().tags.tags).map(([key, value]) => {
                return [
                    key,
                    {
                        id: value.id,
                        selected:
                            this.#isEdit() && this.#editData.tags !== null ? this.#editData.tags.includes(key) : false,
                    },
                ];
            })
        );
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
        formData.set(
            "tags",
            Object.entries(this.#tags.tags)
                .filter(([_, value]) => value.selected)
                .map(([key, _]) => key)
                .join(",")
        );

        const sendForm = (data: FormData) => {
            const isCreate = !this.#isEdit();
            const ajaxMethod = isCreate ? ajax.post.bind(ajax) : ajax.patch.bind(ajax);
            const url: string = "/events" + (!isCreate && this.#editData !== undefined ? `/${this.#editData.id}` : "");

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

        if (this.#tempFileUrl !== undefined) {
            toWebP(this.#tempFileUrl, (imageBlob: Blob) => {
                formData.set("file", imageBlob);
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
        if (kickUnauthorized(store.getState().user)) {
            return "";
        }

        if (Object.keys(store.getState().tags).length === 0 || this.#loadStatus === LoadStatus.LOADING) {
            return "Loadig . . .";
        } else if (Object.keys(this.#tags.tags).length === 0) {
            this.#setTags();
        }

        return EventCreateTemplate({
            ...this.#editData,
            isEdit: this.#isEdit(),
            img: this.#tempFileUrl || this.#editData.img,
            hasImg: this.#tempFileUrl !== undefined || this.#editData.img,
            tags: this.#tagsComponent.render(),
        });
    }
}
