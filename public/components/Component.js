export class Component {
    static #staticId = 0;
    #id;
    #parent;
    #children = [];

    constructor(parent) {
        this.#parent = parent;
        this.#id = Component.#staticId++;
    }

    get id() {
        return this.#id;
    }

    get parent() {
        return this.#parent;
    }

    get children() {
        return this.#children;
    }

    createComponent(type, ...args) {
        console.log(...args);
        const newComponent = new type(this, ...args);
        this.#children.push(newComponent);
        return newComponent;
    }

    removeChildEvents() {
        this.children.forEach((child) => {
            try {
                child.removeEvents();
            } catch (e) {
                console.log(e);
            }
        });
    }

    addChildEvents() {
        this.#children.forEach((child) => child.addEvents());
    }

    rerender() {
        this.removeChildEvents();
        this.#parent.rerender();
        this.addChildEvents();
    }

    render() {
        return "";
    }
}
