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
        console.log("setEdit");
        // TODO fetch data to edit
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

        // this.#editData = {
        //     id: ,
        //     name: "name",
        //     desc: "desc",
        //     dateStart: "06.03.2023",
        //     dateEnd: "09.03.2023",
        //     timeStart: "17:00",
        //     timeEnd: "19:00",
        //     place: "place",
        //     img: "http://localhost:8000/uploads/img/events/musical.jpg",
        // };
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

        let ajaxMethod = this.#processingState === ProcessingState.CREATE ? ajax.post.bind(ajax) : ajax.post.bind(ajax); // TODO change second post to patch

        ajaxMethod({ url: "/events", body: formData, headers: { "Content-Type": "multipart/form-data" } })
            .then()
            .catch((error) => {
                console.log(error);
            });

        console.log("submit");
    }

    render() {
        const isEdit: boolean = this.#processingState === ProcessingState.EDIT;
        const startData = isEdit ? this.#editData : {};
        return EventCreateTemplate({ ...startData, isEdit });
    }
}
