import { Component } from "/components/Component.js";
import EventCardTemplate from "/compiled/Events/EventCard/EventCard.handlebars.js";
import EventCardMarkerTemplate from "/compiled/Events/EventCard/EventCardMarker.handlebars.js";

export class EventCard extends Component {
    constructor(parent) {
        super(parent);
    }

    render() {
        return EventCardTemplate({
            img_src: "assets/event_test.png",
            title: "Мне сказали, что названиеобычно длиннее одного слова",
            description: "С таким названием длинное-предлинное описание уже не кажется таким уж длинным ",
            dates: EventCardMarkerTemplate({
                img_src: "/assets/calendar_icon.png",
                title: "Даты",
                items: ["1 марта 18:00-21:00", "2 марта"],
            }),
            places: EventCardMarkerTemplate({
                img_src: "/assets/position_icon.png",
                title: "Места",
                items: ["Парк Лужники", "МЦДЦ Москва-Сити"],
            }),
        });
    }
}
