/** @module Components */

/**
 * @class
 * @classdesc base Component class
 */
export class Component {
    static #staticId = 0;
    #id;
    #parent;
    #children = [];

    /*
    // type EventMap = {
    //   el: () => HTMLElement | HtmlCollection;
    //   event: string;
    //   callback: (event) => void;
    // }
    */
    #eventMaps = [];

    /**
     * @constructor
     * @param {Component} parent
     */
    constructor(parent) {
        this.#parent = parent;
        this.#id = Component.#staticId++;
    }

    /**
     * id
     * @type {number}
     */
    get id() {
        return this.#id;
    }

    /**
     * parent
     * @type {Component}
     */
    get parent() {
        return this.#parent;
    }

    /**
     * children
     * @type {HTMLCollection}
     */
    get children() {
        return this.#children;
    }

    /**
     * creates a new child component
     * @param {Class.<Component>} type - component class which should be created
     * @param  {...any} args - arguments passed to new component
     * @returns {Component} - a newly created component
     */
    createComponent(type, ...args) {
        const newComponent = new type(this, ...args);
        this.#children.push(newComponent);
        return newComponent;
    }

    /**
     * Description of element getter function
     * @name HTMLElementGetter
     * @function
     * @returns {HTMLElement | HTMLCollection}
     */

    /**
     * register an event handler
     * @param {HTMLELEmentGetter} el - function that returns html element
     * @param {string} event - name of event
     * @param {function} callback - event handler
     */
    registerEvent(el, event, callback) {
        this.#eventMaps.push({
            el: el,
            event: event,
            callback: callback,
        });
    }

    /**
     * removes registered event handlers from children
     */
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

    /**
     * adds registered event handlers to children
     */
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

    /**
     * function called right after render and addEvents
     */
    postRender() {}

    /**
     * removes registered event handlers
     */
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

    /**
     * adds registered event handlers
     */
    addEvents() {
        for (const eventMap of this.#eventMaps) {
            const element = eventMap.el();

            if (element instanceof HTMLElement) {
                console.log(element)
                element.addEventListener(eventMap.event, eventMap.callback);
            } else if (element instanceof HTMLCollection) {
                for (let i = 0; i < element.length; i++) {
                    element[i].addEventListener(eventMap.event, eventMap.callback);
                }
            }
        }
    }

    /**
     * rerenders components
     */
    rerender() {
        this.#parent.rerender();
    }

    /**
     * renders component
     * @returns {string} - html text
     */
    render() {
        return "";
    }
}
