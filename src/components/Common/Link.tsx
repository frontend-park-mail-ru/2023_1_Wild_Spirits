/** @module Components */

import { router } from "modules/router";
import { createVNode, Component } from "modules/vdom";

interface LinkProps {
    id?: string;
    href: string;
    className?: string;
    children: JSX.Element[] | JSX.Element | string;
    onClick?: ()=>void;
}

/**
 * event card component
 * @class
 * @extends Component
 */
export class Link extends Component<LinkProps> {
    constructor(props: LinkProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: PointerEvent) {
        console.log(event);
        event.preventDefault();
        
        if (this.props.onClick) {
            this.props.onClick();
        }

        router.go(this.props.href);
    }

    render() {
        return (
            <a
                id={this.props.id}
                className={this.props.className}
                href={this.props.href}
                onClick={(e) => this.handleClick(e as unknown as PointerEvent)}
            >
                {Array.isArray(this.props.children) ? this.props.children.map((child) => child) : this.props.children}
            </a>
        );
    }
}
