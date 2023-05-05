/** @module Components */

import { VDOM, Component } from "modules/vdom";

export type TableProp = { title: string; value: string };

export interface TabelProps {
    data: TableProp[];
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
                {this.props.data
                    .map((element) => [
                        <div className="table__cell-title">{element.title}</div>,
                        <div className="table__cell">{element.value}</div>,
                    ])
                    .flat()}
            </div>
        );
    }
}
