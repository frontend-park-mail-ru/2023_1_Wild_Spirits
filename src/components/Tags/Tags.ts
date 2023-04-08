/** @module Components */

import { Component } from "components/Component";
import TagsTemplate from "templates/Tags/Tags.handlebars";

import { store } from "flux";
import { toggleTag } from "flux/slices/tagsSlice";
import { loadEvents } from "requests/events";

/**
 * @class
 * @extends Component
 * Component for tags menu
 */

export class Tags extends Component {
    constructor(parent: Component) {
        super(parent)

        this.registerEvent(()=>document.getElementsByClassName("tag"), "click", this.#toggleTag);
    }

    #toggleTag = (event: PointerEvent) => {
        event.preventDefault();

        let el = event.target as HTMLElement;

        store.dispatch(toggleTag({tag: el.innerText}));
        loadEvents();
    }

    render() {
        return TagsTemplate({
            tags: store.getState().tags
        });
    }
}
