import { Component } from "components/Component";
import config from "config";
import { ajax } from "modules/ajax";
import { router } from "modules/router";
import { ResponseEvent } from "responses/ResponseEvent";
import EventCreateTemplate from "templates/Events/EventProcessing/EventProcessing.handlebars";

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
    dateStart: string;
    dateEnd: string;
    timeStart: string;
    timeEnd: string;
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
    #editData: EventProcessingForm | undefined = undefined;

    constructor(parent: Component) {
        super(parent);

        this.registerEvent(
            () => document.getElementById("event-processing-form"),
            "submit",
            this.#handleSubmit.bind(this)
        );
    }

    setCreate() {
        this.#processingState = ProcessingState.CREATE;
    }

    setEdit() {
        const eventId = parseInt(router.getNextUrl().slice(1));
        ajax.get<ResponseEvent>({ url: `/events/${eventId}` })
            .then(({ json, response }) => {
                if (response.ok) {
                    this.#editData = json.body!.event as EventProcessingForm;
                    this.#editData.dateStart = this.encodeDate(this.#editData.dateStart);
                    this.#editData.dateEnd = this.encodeDate(this.#editData.dateEnd);
                    this.#editData.img = config.HOST + "/" + this.#editData.img;
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
        [splt[0], splt[2]] = [splt[2], splt[1]];
        return splt.join(".");
    }
    encodeDate(date: string): string {
        let splt = date.split(".");
        [splt[0], splt[2]] = [splt[2], splt[1]];
        return splt.join("-");
    }

    #handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        let formData = new FormData(event.target as HTMLFormElement);
        for (const entr of formData.entries()) {
            console.log(entr);
        }

        // const eventBody: EventBody = {
        //     name: formData.get("name") as string,
        //     desc: formData.get("desc") as string,
        //     places: [],
        //     categories: [],
        //     tags: [],
        //     dates: {
        //         dateStart: this.formateDate(formData.get("date-first") as string),
        //         dateEnd: this.formateDate(formData.get("date-second") as string),
        //         timeStart: formData.get("time-first") as string,
        //         timeEnd: formData.get("time-second") as string,
        //         weakdays: [1, 2, 3, 4, 5, 6, 7],
        //     },
        // };
        // //formData

        let ajaxMethod =
            this.#processingState === ProcessingState.CREATE ? ajax.post.bind(ajax) : ajax.patch.bind(ajax); // TODO change second post to patch

        ajax.removeHeaders("Content-Type");
        ajaxMethod({ url: "/events", credentials: true, body: formData })
            .then()
            .catch((error) => {
                console.log(error);
            });
        ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });
    }

    render() {
        const isEdit: boolean = this.#processingState === ProcessingState.EDIT;
        const startData = isEdit ? this.#editData : {};
        return EventCreateTemplate({ ...startData, isEdit });
    }
}
