/** @module Components */

export type ComponentParentType = Component | HTMLElement;

type EventMapElement = () => HTMLElement | HTMLCollection | null;
type EventMapType = keyof HTMLElementEventMap;
type EventMapEvent = (event: Event) => void;
type GenericEventMapEvent<T extends Event> = (event: T) => void;

/**
 * @class
 * @classdesc base Component class
 */
export class Component {
    static #staticId: number = 0;
    #id: number;
    #parent: ComponentParentType;
    #children: Component[] = [];

    #eventMaps: { element: EventMapElement; eventName: EventMapType; callback: EventMapEvent }[] = [];

    /**
     * @constructor
     * @param {Component} parent
     */
    constructor(parent: ComponentParentType) {
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
    createComponent<T extends Component, Params extends any[]>(
        c: { new (parent: Component, ...args: Params): T },
        ...args: Params
    ): T {
        const newComponent = new c(this, ...args);
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
     * @param {HTMLELementGetter} element - function that returns html element
     * @param {string} eventName - name of event
     * @param {function} callback - event handler
     */
    registerEvent<T extends Event>(
        element: EventMapElement,
        eventName: EventMapType,
        callback: GenericEventMapEvent<T>
    ) {
        this.#eventMaps.push({
            element,
            eventName,
            callback: callback as EventMapEvent,
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
            } catch (error) {
                console.log(error);
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
            } catch (error) {
                console.log(error);
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
            const element = eventMap.element();

            if (element instanceof HTMLElement) {
                element.removeEventListener(eventMap.eventName, eventMap.callback);
            } else if (element instanceof HTMLCollection) {
                for (const el of element) {
                    el.removeEventListener(eventMap.eventName, eventMap.callback);
                }
            }
        }
    }

    /**
     * adds registered event handlers
     */
    addEvents() {
        for (const eventMap of this.#eventMaps) {
            const element = eventMap.element();

            if (element instanceof HTMLElement) {
                element.addEventListener(eventMap.eventName, eventMap.callback);
            } else if (element instanceof HTMLCollection) {
                for (let i = 0; i < element.length; i++) {
                    element[i].addEventListener(eventMap.eventName, eventMap.callback);
                }
            }
        }
    }

    /**
     * rerenders components
     */
    rerender() {
        if (this.#parent instanceof Component) {
            this.#parent.rerender();
        }
    }

    /**
     * renders component
     * @returns {string} - html text
     */
    render(): string {
        return "";
    }
}
