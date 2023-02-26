import { Component } from "./Component.js";
import OtherComponentTemplate from "./OtherComponent.handlebars.js";

export class OtherComponent extends Component {
    #counter;
    constructor(parent, { count }) {
        super(parent);
        this.#counter = count;
    }

    btnClick = () => {
        console.log("OC click");
        this.#counter++;
        this.rerender();
    };

    removeEvents() {
        const btn = document.getElementById(this.id);
        btn.removeEventListener("click", this.btnClick);
    }

    addEvents() {
        const btn = document.getElementById(this.id);
        btn.addEventListener("click", this.btnClick);
    }

    render() {
        const tmp = OtherComponentTemplate({ counter: this.#counter, id: this.id });

        return tmp;
    }
}
