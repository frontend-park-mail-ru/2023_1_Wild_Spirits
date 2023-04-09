import { Component } from "components/Component";
import { ajax } from "modules/ajax";
import EventCreateTemplate from "templates/Events/EventProcessing/EventProcessing.handlebars";

interface EventBody {
    name: string;
    desc: string;
    places: number[];
    categories: number[];
    tags: number[];
    dates: { dateStart?: string; dateEnd?: string; timeStart?: string; timeEnd?: string; weakdays: number[] };
}

namespace ProcessingState {
    export const CREATE = "CREATE";
    export const EDIT = "EDIT";
    export type Type = typeof CREATE | typeof EDIT;
}

export class EventProcessing extends Component {
    processingState: ProcessingState.Type = ProcessingState.CREATE;

    constructor(parent: Component) {
        super(parent);

        this.registerEvent(
            () => document.getElementById("event-processing-form"),
            "submit",
            this.#handleSubmit.bind(this)
        );
    }

    setCreate() {
        this.processingState = ProcessingState.CREATE;
    }

    setEdit() {
        this.processingState = ProcessingState.EDIT;
    }

    formateDate(date: string): string {
        return date.split("-").join(".");
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

        let ajaxMethod = this.processingState === ProcessingState.CREATE ? ajax.post.bind(ajax) : ajax.post.bind(ajax); // TODO change second post to patch

        ajaxMethod({ url: "/events", body: formData, headers: { "Content-Type": "multipart/form-data" } })
            .then()
            .catch((error) => {
                console.log(error);
            });

        console.log("submit");
    }

    render() {
        return EventCreateTemplate();
    }
}
