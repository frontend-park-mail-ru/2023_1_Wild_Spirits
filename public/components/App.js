import { Component } from "./Component.js";
import { OtherComponent } from "./OtherComponent.js";

export class App extends Component {
    #pageComponent;
    #pageComponent2;
    constructor(parent) {
        super(parent);
        this.#pageComponent = this.createComponent(OtherComponent, { count: 1 });
        this.#pageComponent2 = this.createComponent(OtherComponent, { count: 88 });
    }

    rerender() {
        this.removeChildEvents();
        this.parent.innerHTML = this.render();
        this.addChildEvents();
    }

    render() {
        return `
            <div> 
                React App :) 
                ${this.#pageComponent.render()} 
                ${this.#pageComponent2.render()} 
            </div>
        `;
    }
}
