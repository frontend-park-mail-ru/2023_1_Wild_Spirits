/** @module Components */

import { Component } from "components/Component";
import TagsTemplate from "templates/Tags/Tags.handlebars";

import { store } from "flux";
import { TagsState } from "flux/slices/tagsSlice";
import { loadEvents } from "requests/events";
import "./styles.scss";

/**
 * @class
 * @extends Component
 * Component for tags menu
 */

export type ToggleTagFuncProps = { tag: string };

type ToggleTagFunc = (props: ToggleTagFuncProps) => void;

export class Tags extends Component {
    #toggleTag: ToggleTagFunc;
    #getTagsState: () => TagsState;
    #className: string;
    constructor(parent: Component, className: string, getTagsState: () => TagsState, toggleTag: ToggleTagFunc) {
        super(parent);

        this.#className = className;
        this.#toggleTag = toggleTag;
        this.#getTagsState = getTagsState;

        this.registerEvent(() => document.getElementsByClassName(className), "click", this.#handleClick);
    }

    #handleClick = (event: PointerEvent) => {
        event.preventDefault();

        let el = event.target as HTMLElement;

        this.#toggleTag({ tag: el.innerText });

        // loadEvents();
    };

    render() {
        return TagsTemplate({
            tags: this.#getTagsState(),
            className: this.#className,
        });
    }
}
