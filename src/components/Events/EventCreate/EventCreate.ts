import { Component } from "components/Component";
import EventCreateTemplate from "templates/Events/EventCreate/EventCreate.handlebars";

export class EventCreate extends Component {
    constructor(parent: Component) {
        super(parent);
    }

    render() {
        return EventCreateTemplate({});
    }
}
