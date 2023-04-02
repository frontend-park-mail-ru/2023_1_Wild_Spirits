/** @module Components */

import { Component } from "components/Component";

/**
 * Registration component
 * @class
 * @extends Component
 */
export class Profile extends Component {
    constructor(parent: Component) {
        super(parent);
    }

    render() {
        return "<div> <h1> Profile Page </h1> </div>";
    }
}
