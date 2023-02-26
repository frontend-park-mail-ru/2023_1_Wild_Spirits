export class OtherComponent {
    #parent;
    #counter;
    constructor(parent) {
        this.#parent = parent;
        this.#counter = 0;
    }

    rerender() {
        // Clear events
        // ...

        this.#parent.rerender();
        console.log("R OC");

        // Set events
        // this.initEvents();
    }

    btnClick = () => {
        console.log("OC click");
        this.#counter++;
        this.rerender();
    };

    removeEvents() {
        const btn = document.getElementById("test-button");
        if (btn) {
            btn.removeEventListener("click", this.btnClick);
        } else {
            console.log("No btn");
        }
    }

    addEvents() {
        const btn = document.getElementById("test-button");
        btn.addEventListener("click", this.btnClick);
    }

    render() {
        return `
            <div> 
                Other Component ${this.#counter}
                <input id="test-button" type="button" value="Test" />
            </div>
        `;
    }
}
