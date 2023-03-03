import { Component } from "/components/Component.js";
import { Header } from "./Header/Header.js";
import AppTemplate from "/compiled/App.handlebars.js";
import { EventList } from "./Events/EventList/EventList.js";

export class App extends Component {
    #headerComponent;
    #contentComponent;
    constructor(parent) {
        super(parent);
        this.#headerComponent = this.createComponent(Header);
        this.#contentComponent = this.createComponent(EventList);
    }

    rerender() {
        this.removeChildEvents();
        this.parent.innerHTML = this.render();
        this.addChildEvents();
    }

    render() {
        // if (router.getUrlExact("/link1")) {

        // } else if (router.getUrlExact("/link2")) {

        // } else if (router.getUrl("/link")) {

        // }
        const template = AppTemplate({
            header: this.#headerComponent.render(),
            content: this.#contentComponent.render(),
            footer: "Footer",
        });
        return template;
    }
}

class Route {}

// /link1

// / link / dasadas / 29 / dasda;
// / link / yyuy / 29 / dasda;

// router = new Route();
