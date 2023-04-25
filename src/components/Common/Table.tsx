/** @module Components */

import { createVNode, Component } from "modules/vdom";

export interface TabelProps {
    data: { title: string; value: string }[];
}
/**
 * Event list component
 * @class
 * @extends Component
 */
export class Table extends Component<TabelProps> {
    constructor(props: TabelProps) {
        super(props);
    }

    render() {
        return (
            <div className="table">
                {this.props.data.map((element) => (
                    <div className="table__block">
                        <div className="table__cell grey">{element.title}</div>
                        <div className="table__cell">{element.value}</div>
                    </div>
                ))}
            </div>
        );
    }
}
