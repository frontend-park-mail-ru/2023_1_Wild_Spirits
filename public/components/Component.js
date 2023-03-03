export class Component {
    static #staticId = 0;
    #id;
    #parent;
    #children = [];

    /*
    // type EventMap = {
    //   el: () => HTMLElementCollection;
    //   event: string;
    //   callback: (event) => void;
    // }
    */
    #eventMaps = [];

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
        const newComponent = new type(this, ...args);
        this.#children.push(newComponent);
        return newComponent;
    }

    registerEvent(el, event, callback) {
        this.#eventMaps.push({
            el: el,
            event: event,
            callback: callback
        });
    }

    removeChildEvents() {
        this.#children.forEach((child) => {
            try {
                child.removeChildEvents();
                child.removeEvents();
            } catch (e) {
                console.log(e);
            }
        });
    }

    addChildEvents() {
        this.#children.forEach((child) => {
            try {
                child.addEvents();
                child.postRender();
                child.addChildEvents();
            } catch (e) {
                console.log(e);
            }
        });
    }

    postRender() {}

    removeEvents() {
        for (const eventMap of this.#eventMaps) {

            const element = eventMap.el();

            if (element instanceof HTMLElement) {
                element.removeEventListener(eventMap.event, eventMap.callback);
            } else if (element instanceof HTMLCollection) {
                for (const el of element) {
                    el.removeEventListener(eventMap.event, eventMap.callback);
                }
            }
        }
    }
    addEvents() {
        for (const eventMap of this.#eventMaps) {

            const element = eventMap.el();

            if (element instanceof HTMLElement) {
                element.addEventListener(eventMap.event, eventMap.callback);
            } else if (element instanceof HTMLCollection) {
                for (let i = 0; i < element.length; i++) {
                    element[i].addEventListener(eventMap.event, eventMap.callback);
                }
            }
        }
    }

    rerender() {
        this.#parent.rerender();
    }

    render() {
        return "";
    }
}
