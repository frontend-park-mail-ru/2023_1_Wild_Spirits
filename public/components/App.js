import { OtherComponent } from "./OtherComponent.js";

export class App {
    #parent;
    #pageComponent;
    constructor(parent) {
        this.#parent = parent;
        this.#pageComponent = new OtherComponent(this);
    }

    rerender() {
        this.#pageComponent.removeEvents();
        this.#parent.innerHTML = this.render();
        this.#pageComponent.addEvents();
    }

    render() {
        return `<div> React App :) ${this.#pageComponent.render()} </>`;
    }
}
