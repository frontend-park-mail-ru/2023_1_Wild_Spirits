/** @module Components */

import { Component } from "components/Component";
import TagsTemplate from "templates/Tags/Tags.handlebars";

import { store } from "flux";
import { TagsState, toggleTag } from "flux/slices/tagsSlice";
import { loadEvents } from "requests/events";
import "./styles.scss";
import { Tags } from "./Tags";

/**
 * @class
 * @extends Component
 * Component for tags menu
 */

export type ToggleTagFuncProps = { tag: string };

type ToggleTagFunc = (props: ToggleTagFuncProps) => void;

export class SidebarTags extends Component {
    #tagsComponent: Tags;
    constructor(parent: Component) {
        super(parent);

        this.#tagsComponent = this.createComponent(
            Tags,
            "tag-clickable",
            () => store.getState().tags.tags,
            (props: ToggleTagFuncProps) => {
                store.dispatch(toggleTag(props));
            }
        );
    }

    render() {
        return this.#tagsComponent.render();
    }
}
