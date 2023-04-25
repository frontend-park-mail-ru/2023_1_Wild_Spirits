import { deepEqual } from "./objectsManipulation";

type PropType = Function | null | false | string | undefined;

type PropsType = { [key: string]: PropType };

type ChildType = VNodeType | string | undefined | null | boolean;

// type FunctionComponent = (props: PropsType, children: ChildType[]) => VNodeType;

type TagNameFuncType<TProps> = (props: TProps, children: ChildType[]) => VNodeType;
type ComponentConstructor<T extends Component<TProps>, TProps> = new (props: TProps, ...children: ChildType[]) => T;
type TagNameType<T extends Component<TProps>, TProps> =
    | string
    | TagNameFuncType<TProps>
    | ComponentConstructor<T, TProps>;

const InstanceFieldName = "_instance" as const;

type TagVNodeType = { tagName: string; props: PropsType; children: ChildType[] };
type ComponentVNodeType = TagVNodeType & { [InstanceFieldName]: Component };
type SimpleVNodeType = string | undefined | null | boolean;
export type VNodeType = SimpleVNodeType | TagVNodeType | ComponentVNodeType;

export type DOMNodeType = (HTMLElement | ChildNode) & { v?: VNodeType }; // TODO Create custom type

export abstract class Component<TProps extends any = any, TState = {}> {
    context: unknown;
    props: TProps;
    state: TState;
    refs: any;

    constructor(props: TProps) {
        this.state = {} as TState;
        this.props = props;
    }

    setState(newState: TState) {
        this.state = newState;
        patchVDOM();
    }

    didCreate() {}

    willUpdate() {}

    didUpdate() {}

    willDestroy() {}

    forceUpdate() {
        patchVDOM();
    }

    abstract render(): JSX.Element;
}

type VDOMRenderFunc = () => JSX.Element;

interface VDOM {
    root: DOMNodeType;
    renderFunc: VDOMRenderFunc;

    isRerendering: boolean;
    needRerender: boolean;
}

let rootVDOM: VDOM | undefined = undefined;

export const patchVDOM = () => {
    if (rootVDOM === undefined) {
        return;
    }

    if (!rootVDOM.isRerendering) {
        rootVDOM.isRerendering = true;
        rootVDOM.root = patch(rootVDOM.renderFunc() as unknown as VNodeType, rootVDOM.root);
        rootVDOM.isRerendering = false;
        if (rootVDOM.needRerender) {
            rootVDOM.needRerender = false;
            patchVDOM();
        }
    } else {
        rootVDOM.needRerender = true;
    }
};

export const createVDOM = (root: HTMLElement, renderFunc: VDOMRenderFunc) => {
    rootVDOM = {
        root: patch(renderFunc() as unknown as VNodeType, root),
        renderFunc,
        isRerendering: false,
        needRerender: false,
    };
};

const JSXToVNode = (jsx: JSX.Element): TagVNodeType => jsx as unknown as TagVNodeType;

export namespace VDOM {
    export const createVNode = <T extends Component<TProps>, TProps extends PropsType = PropsType>(
        tagName: TagNameType<T, TProps>,
        props: TProps = {} as TProps,
        ...children: ChildType[]
    ): VNodeType => {
        if (typeof tagName === "function") {
            try {
                const result: VNodeType = (tagName as TagNameFuncType<TProps>)(props, children);
                return result;
            } catch {
                const instance = new (tagName as ComponentConstructor<T, TProps>)({ ...props, children });
                const jsx = JSXToVNode(instance.render());
                if (Array.isArray(jsx)) {
                    (jsx as any)._instance = instance;
                    return jsx;
                }
                let vnode: ComponentVNodeType = { ...JSXToVNode(instance.render()), _instance: instance };
                return vnode;
            }
        }

        return {
            tagName,
            props,
            children: children.flat(),
        };
    };

    export const createFragment = (_: any, args: any[]) => {
        return args;
    };
}

const isNodeTypeComponent = (vNode: VNodeType): vNode is ComponentVNodeType => {
    return !isNodeTypeSimple(vNode) && vNode.hasOwnProperty(InstanceFieldName);
};

const isNodeTypeTag = (vNode: VNodeType): vNode is TagVNodeType => {
    return !isNodeTypeSimple(vNode) && !vNode.hasOwnProperty(InstanceFieldName);
};

const isNodeTypeSimple = (vNode: VNodeType): vNode is SimpleVNodeType => {
    return (
        typeof vNode === "string" || typeof vNode === "boolean" || typeof vNode === "undefined" || typeof vNode === null
    );
};

export const createDOMNode = (vNode: VNodeType) => {
    if (typeof vNode === "string") {
        return document.createTextNode(vNode);
    }
    if (isNodeTypeSimple(vNode)) {
        return document.createTextNode("");
    }

    const { tagName, props, children } = vNode;

    const node = document.createElement(tagName);

    patchProps(node, {}, props);

    children.forEach((child) => {
        node.appendChild(createDOMNode(child));
    });

    if (isNodeTypeComponent(vNode)) {
        vNode._instance.didCreate();
    }

    return node;
};

const tryCopyState = (vNode: ComponentVNodeType, nextVNode: ComponentVNodeType): boolean => {
    const result = !deepEqual(nextVNode._instance.state, vNode._instance.state);
    nextVNode._instance.state = vNode._instance.state;
    return result;
};

export const patchNode = (node: DOMNodeType, vNode: VNodeType, nextVNode: VNodeType) => {
    // TODO ???
    // if (nextVNode === undefined) {
    //     node.remove();
    //     return;
    // }

    if (isNodeTypeComponent(vNode) && isNodeTypeComponent(nextVNode) && tryCopyState(vNode, nextVNode)) {
        nextVNode = { ...JSXToVNode(nextVNode._instance.render()), _instance: nextVNode._instance };
    }

    if (isNodeTypeSimple(vNode) || isNodeTypeSimple(nextVNode)) {
        if (vNode !== nextVNode) {
            if (isNodeTypeComponent(vNode)) {
                vNode._instance.willDestroy();
            }
            const nextNode = createDOMNode(nextVNode);
            node.replaceWith(nextNode);
            return nextNode;
        }

        return node;
    }

    if (vNode.tagName !== nextVNode.tagName) {
        if (isNodeTypeComponent(vNode)) {
            vNode._instance.willDestroy();
        }
        const nextNode = createDOMNode(nextVNode);
        node.replaceWith(nextNode);
        return nextNode;
    }

    const instancePropsChanged =
        isNodeTypeComponent(vNode) &&
        isNodeTypeComponent(nextVNode) &&
        !deepEqual(vNode._instance.props, nextVNode._instance.props);
    if (isNodeTypeComponent(nextVNode) && instancePropsChanged) {
        nextVNode._instance.willUpdate();
    }

    patchProps(node, vNode.props, nextVNode.props);
    patchChildren(node, vNode.children, nextVNode.children);

    if (isNodeTypeComponent(nextVNode) && instancePropsChanged) {
        nextVNode._instance.didUpdate();
    }

    return node;
};

const convertKey = (key: string) => {
    switch (key) {
        case "className":
            return "class";
        case "htmlFor":
            return "for";
    }
    return key.toLowerCase();
};

const patchProp = (node: DOMNodeType, key: string, value: PropType, nextValue: PropType) => {
    key = convertKey(key);
    if (((nextValue: PropType): nextValue is Function => key.startsWith("on"))(nextValue)) {
        const eventName = key.slice(2);

        (node as any)[eventName] = nextValue;

        if (!nextValue) {
            node.removeEventListener(eventName, listener);
        } else if (!value) {
            node.addEventListener(eventName, listener);
        }
        return;
    }

    if (nextValue === null || nextValue === undefined || nextValue === false) {
        (node as HTMLElement).removeAttribute(key);
        return;
    }

    (node as HTMLElement).setAttribute(key, nextValue);
};

const patchProps = (node: DOMNodeType, props: PropsType | null, nextProps: PropsType | null) => {
    const mergedProps = { ...props, ...nextProps };

    Object.keys(mergedProps).forEach((key) => {
        if (props === null || nextProps === null || props[key] !== nextProps[key]) {
            patchProp(
                node,
                key,
                props !== null ? props[key] : undefined,
                nextProps !== null ? nextProps[key] : undefined
            );
        }
    });
};

const patchChildren = (parent: DOMNodeType, vChildren: VNodeType[], nextVChildren: VNodeType[]) => {
    const nextVChildrenLength = nextVChildren ? nextVChildren.length : 0;

    parent.childNodes.forEach((childNode, i) => {
        patchNode(childNode, vChildren[i], nextVChildren[i]);
    });

    nextVChildren.slice(vChildren.length).forEach((vChild) => {
        parent.appendChild(createDOMNode(vChild));
    });

    const curChildLenght = parent.childNodes.length;

    for (let i = nextVChildrenLength; i < curChildLenght; i++) {
        // TODO destroy(parent.childNodes[nextVChildrenLength]);
        parent.removeChild(parent.childNodes[nextVChildrenLength]);
    }
};

export const patch = (nextVNode: VNodeType, node: DOMNodeType) => {
    const vNode = node.v || recycleNode(node);

    const newNode = patchNode(node, vNode, nextVNode);
    if (newNode) {
        node = newNode;
        node.v = nextVNode;
    }
    return node;
};

const TEXT_NODE_TYPE = 3;

const recycleNode = (node: DOMNodeType) => {
    if (node.nodeType === TEXT_NODE_TYPE) {
        return node.nodeValue;
    }

    const tagName = node.nodeName.toLowerCase();
    const children: ChildType[] = [].map.call(node.childNodes, recycleNode) as ChildType[];

    return VDOM.createVNode(tagName, {}, children as any);
};

function listener(this: any, event: Event) {
    return this[event.type](event);
}
