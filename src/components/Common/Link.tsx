/** @module Components */

import { toPointerEvent } from "modules/CastEvents";
import { router } from "modules/router";
import { VDOM, Component } from "modules/vdom";

import { store } from "flux";
import { requestManager } from "requests";
import { loadLikedEvents, loadPlannedEvents, loadProfileOrgEvents, loadSubbedEvents } from "requests/events";
import { loadProfile } from "requests/user";
import {
    setLikedEventsLoadStart,
    setOrgEventsLoadStart,
    setPlannedEventsLoadStart,
    setSubbedEventsLoadStart,
} from "flux/slices/eventSlice";

interface LinkProps {
    id?: string;
    href: string;
    className?: string;
    children: JSX.Element[] | JSX.Element | string;
    onClick?: () => void;
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
        event.preventDefault();

        router.go(this.props.href);

        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render() {
        return (
            <a
                id={this.props.id}
                className={this.props.className}
                href={this.props.href}
                onClick={(e) => {
                        this.handleClick(toPointerEvent(e));
                    }
                }
            >
                {Array.isArray(this.props.children)
                    ? this.props.children.map((child) => child).flat()
                    : this.props.children}
            </a>
        );
    }
}

export const loadProfileEvents = () => {
    store.dispatch(
        setSubbedEventsLoadStart(),
        setOrgEventsLoadStart(),
        setLikedEventsLoadStart(),
        setPlannedEventsLoadStart()
    );
    requestManager.request(loadSubbedEvents);
    requestManager.request(loadProfileOrgEvents);
    requestManager.request(loadLikedEvents);
    requestManager.request(loadPlannedEvents);
};

export const ProfileLink = (props: LinkProps) => {
    const onClick = () => {
        if (router.isUrlChanged()) {
            requestManager.removeDone(loadProfile);
            props.onClick && props.onClick();
            loadProfileEvents();
        }
    };
    return (
        <div>
            <Link {...props} onClick={()=>{console.log('profile link'); onClick()}}>
                {Array.isArray(props.children) ? props.children.map((child) => child) : props.children}
            </Link>
        </div>
    );
};
