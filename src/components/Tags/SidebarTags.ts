/** @module Components */

import { Component } from "components/Component";

import { store } from "flux";
import { toggleTag } from "flux/slices/tagsSlice";
import { loadEvents } from "requests/events";
import "./styles.scss";
import { Tags } from "./Tags";
import { requestManager } from "requests";

/**
 * @class
 * @extends Component
 * Component for tags menu
 */

export type ToggleTagFuncProps = { tag: string };

export class SidebarTags extends Component {
    #tagsComponent: Tags;
    constructor(parent: Component) {
        super(parent);

        this.#tagsComponent = this.createComponent(
            Tags,
            "tag-clickable",
            () => store.getState().tags,
            (props: ToggleTagFuncProps) => {
                store.dispatch(toggleTag(props));
                requestManager.request(loadEvents);
            }
        );
    }

    render() {
        return this.#tagsComponent.render();
    }
}
