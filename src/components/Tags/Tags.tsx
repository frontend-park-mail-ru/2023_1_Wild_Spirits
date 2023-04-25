/** @module Components */

import { createVNode, Component } from "modules/vdom";
import { TagsState } from "flux/slices/tagsSlice";

/**
 * @class
 * @extends Component
 * Component for tags menu
 */

export type ToggleTagFuncProps = { tag: string };
type ToggleTagFunc = (props: ToggleTagFuncProps) => void;

interface TagsProps {
    tagsState: TagsState;
    toggleTag?: ToggleTagFunc;
}

export class Tags extends Component<TagsProps> {
    constructor(props: TagsProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (tagName: string) => {
        this.props.toggleTag !== undefined && this.props.toggleTag({ tag: tagName });
    };

    render() {
        console.log(this.props.toggleTag ? "tag" : "tag-selectable");
        console.log(this.props.toggleTag);
        return (
            <div className="tags-menu">
                {Object.entries(this.props.tagsState.tags ? this.props.tagsState.tags : {}).map(
                    ([name, { selected }]) => (
                        <div
                            className={`${this.props.toggleTag ? "tag-selectable" : "tag"} ${selected ? "active" : ""}`}
                            onClick={() => this.handleClick(name)}
                        >
                            {name}
                        </div>
                    )
                )}
            </div>
        );
    }
}
