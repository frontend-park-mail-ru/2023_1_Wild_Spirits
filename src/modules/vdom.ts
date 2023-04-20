export abstract class Component<TProps> {
    context: unknown;
    setState: any;
    forceUpdate: any;
    props: TProps;
    state: any;
    refs: any;

    constructor(props: TProps) {
        this.props = props;
        console.log("Component created!");
    }

    didCreate() {}

    willUpdate() {}

    didUpdate() {}

    willDestroy() {}

    abstract render(): JSX.Element;
}

type PropType = Function | null | false | string | undefined;

type PropsType = { [key: string]: PropType };

type ChildType = VNodeType | string | undefined | null | boolean;

// type FunctionComponent = (props: PropsType, children: ChildType[]) => VNodeType;

type TagNameTypeFunc<TProps> = (props: TProps, children: ChildType[]) => VNodeType;

type ComponentConstructor<T extends Component<TProps>, TProps> = new (props: TProps, ...children: ChildType[]) => T;

type TagNameType<T extends Component<TProps>, TProps> =
    | TagNameTypeFunc<TProps>
    | string
    | ComponentConstructor<T, TProps>;

type NamedVNodeType = { tagName: string; props: PropsType; children: ChildType[] };

export type VNodeType = NamedVNodeType | string | undefined | null | boolean;

export type DOMNodeType = HTMLElement | ChildNode;

export const createVNode = <T extends Component<TProps>, TProps>(
    tagName: TagNameType<T, TProps>,
    props: PropsType | TProps = {},
    ...children: ChildType[]
): VNodeType => {
    console.log("tagName", tagName, "props", props, "children", children, typeof tagName, tagName instanceof Component);
    console.log(tagName);

    if (typeof tagName === "function") {
        try {
            const result = (tagName as TagNameTypeFunc<TProps>)(props as TProps, children);
            return result;
        } catch {
            const result = new (tagName as ComponentConstructor<T, TProps>)(props as TProps, ...children);
            return result.render() as unknown as VNodeType;
        }
    }

    tagName = tagName as string;
    props = props as PropsType;
    return {
        tagName,
        props,
        children: children.flat(),
    };
};

const isTypeStrBoolNone = (vNode: VNodeType) => {
    return typeof vNode === "string" || typeof vNode === "boolean" || vNode == null;
};

export const createDOMNode = (vNode: VNodeType) => {
    if (typeof vNode === "string") {
        return document.createTextNode(vNode);
    }
    if (typeof vNode === "boolean" || vNode == null) {
        return document.createTextNode("");
    }

    const { tagName, props, children } = vNode;

    console.log(vNode);

    const node = document.createElement(tagName);

    patchProps(node, {}, props);

    children.forEach((child) => {
        node.appendChild(createDOMNode(child));
    });

    return node;
};

// export const mount = (node : Node, target) => {
//     target.replaceWith(node);
//     return node;
// };

export const patchNode = (node: DOMNodeType, vNode: VNodeType, nextVNode: VNodeType) => {
    if (nextVNode === undefined) {
        node.remove();
        return;
    }

    if (isTypeStrBoolNone(vNode) || isTypeStrBoolNone(nextVNode)) {
        if (vNode !== nextVNode) {
            const nextNode = createDOMNode(nextVNode);
            node.replaceWith(nextNode);
            return nextNode;
        }

        return node;
    }

    vNode = vNode as NamedVNodeType;
    nextVNode = nextVNode as NamedVNodeType;
    if (vNode.tagName !== nextVNode.tagName) {
        const nextNode = createDOMNode(nextVNode);
        node.replaceWith(nextNode);
        return nextNode;
    }

    patchProps(node, vNode.props, nextVNode.props);
    patchChildren(node, vNode.children, nextVNode.children);

    return node;
};

const patchProp = (node: DOMNodeType, key: string, value: PropType, nextValue: PropType) => {
    key = key.toLowerCase();
    if (key.startsWith("on")) {
        const eventName = key.slice(2) as keyof HTMLElementEventMap;

        (node as any)[eventName] = nextValue;

        if (!nextValue) {
            node.removeEventListener(eventName, listener);
        } else if (!value) {
            node.addEventListener(eventName, listener);
        }
        return;
    }

    if (nextValue == null || nextValue === false) {
        (node as HTMLElement).removeAttribute(key);
        return;
    }

    (node as HTMLElement).setAttribute(key, nextValue as string);
};

const patchProps = (node: DOMNodeType, props: PropsType, nextProps: PropsType) => {
    const mergedProps = { ...props, ...nextProps };

    Object.keys(mergedProps).forEach((key) => {
        if (props[key] !== nextProps[key]) {
            patchProp(node, key, props[key], nextProps[key]);
        }
    });
};

const patchChildren = (parent: DOMNodeType, vChildren: VNodeType[], nextVChildren: VNodeType[]) => {
    parent.childNodes.forEach((childNode, i) => {
        patchNode(childNode, vChildren[i], nextVChildren[i]);
    });

    nextVChildren.slice(vChildren.length).forEach((vChild) => {
        parent.appendChild(createDOMNode(vChild));
    });
};

export const patch = (nextVNode: VNodeType, node: DOMNodeType) => {
    const vNode = (node as any).v || recycleNode(node);

    const newNode = patchNode(node, vNode, nextVNode);
    if (newNode) {
        node = newNode;
        (node as any).v = nextVNode;
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

    return createVNode(tagName, {}, children as any);
};

function listener(this: any, event: Event) {
    return this[event.type](event);
}
