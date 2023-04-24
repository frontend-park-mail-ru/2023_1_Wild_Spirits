import { deepEqual } from "./objectsManipulation";

export abstract class Component<TProps> {
    context: unknown;
    // setState: any;
    forceUpdate: any;
    props: TProps;
    state: any;
    refs: any;

    vNode: VNodeType;
    domNode: DOMNodeType | undefined;

    constructor(props: TProps) {
        this.props = props;
    }

    didCreate() {}

    willUpdate() {}

    didUpdate() {}

    willDestroy() {}

    rerender() {
        console.log(this)
        console.error('rerender', this.vNode, this.domNode);
        if (this.domNode === undefined) {
            console.error("rerendering component without domNode assigned")
            return;
        }
        patchNode(this.domNode, this.vNode, this.render() as unknown as VNodeType);
    }

    setState(state: any) {
        this.state = state;
        this.rerender();
    }

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

type NamedVNodeType = { tagName: string; props: PropsType; children: ChildType[] } & { _instance?: Component<any> };

export type VNodeType = NamedVNodeType | string | undefined | null | boolean;

export type DOMNodeType = HTMLElement | ChildNode;

export const createVNode = <T extends Component<TProps>, TProps>(
    tagName: TagNameType<T, TProps>,
    props: PropsType | TProps = {},
    ...children: ChildType[]
): VNodeType => {
    if (typeof tagName === "function") {
        try {
            const result = (tagName as TagNameTypeFunc<TProps>)(props as TProps, children);
            return result;
        } catch {
            const instance = new (tagName as ComponentConstructor<T, TProps>)(props as TProps, ...children);
            let vnode = instance.render() as unknown as NamedVNodeType;
            instance.vNode = vnode;
            vnode._instance = instance;
            return vnode;
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

const isTypeStrBoolNone = (vNode: VNodeType): boolean => {
    return (
        typeof vNode === "string" || typeof vNode === "boolean" || typeof vNode === "undefined" || typeof vNode === null
    );
};

export const createDOMNode = (vNode: VNodeType) => {
    if (typeof vNode === "string") {
        return document.createTextNode(vNode);
    }
    if (typeof vNode === "boolean" || vNode == null) {
        return document.createTextNode("");
    }

    const { tagName, props, children } = vNode;

    const node = document.createElement(tagName);

    patchProps(node, {}, props);

    children.forEach((child) => {
        node.appendChild(createDOMNode(child));
    });

    let instance = (vNode as NamedVNodeType)?._instance;

    if (instance) {
        // console.log('instance before:', instance);
        (vNode as NamedVNodeType)!._instance!.domNode = node;
        (vNode as NamedVNodeType)!._instance!.didCreate();
        // console.log('instance after:', instance)
    }

    // (vNode as NamedVNodeType)?._instance?.didCreate();

    return node;
};

export const patchNode = (node: DOMNodeType, vNode: VNodeType, nextVNode: VNodeType) => {
    if (nextVNode === undefined) {
        node.remove();
        return;
    }

    if (isTypeStrBoolNone(vNode) || isTypeStrBoolNone(nextVNode)) {
        if (vNode !== nextVNode) {
            if (!isTypeStrBoolNone(vNode)) {
                (vNode as NamedVNodeType)?._instance?.willDestroy();
            }
            const nextNode = createDOMNode(nextVNode);
            node.replaceWith(nextNode);
            return nextNode;
        }

        return node;
    }

    vNode = vNode as NamedVNodeType;
    nextVNode = nextVNode as NamedVNodeType;
    if (vNode.tagName !== nextVNode.tagName) {
        if (!isTypeStrBoolNone(vNode)) {
            (vNode as NamedVNodeType)?._instance?.willDestroy();
        }
        const nextNode = createDOMNode(nextVNode);
        node.replaceWith(nextNode);
        return nextNode;
    }

    const instancePropsChanged = !deepEqual(vNode._instance?.props, nextVNode._instance?.props);
    if (instancePropsChanged) {
        vNode?._instance?.willUpdate();
    }

    patchProps(node, vNode.props, nextVNode.props, vNode);
    patchChildren(node, vNode.children, nextVNode.children);

    if (instancePropsChanged) {
        vNode?._instance?.didUpdate();
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

const patchProps = (node: DOMNodeType, props: PropsType, nextProps: PropsType, vNode: NamedVNodeType | null = null) => {
    const mergedProps = { ...props, ...nextProps };

    Object.keys(mergedProps).forEach((key) => {
        if (props[key] !== nextProps[key]) {
            patchProp(node, key, props[key], nextProps[key]);
        }
    });
};

const patchChildren = (parent: DOMNodeType, vChildren: VNodeType[], nextVChildren: VNodeType[]) => {
    parent.childNodes.forEach((childNode, i) => {
        // console.log('next child:', nextVChildren[i])
        patchNode(childNode, vChildren[i], nextVChildren[i]);
        // console.log('next child:', nextVChildren[i])
    });

    nextVChildren.slice(vChildren.length).forEach((vChild) => {
        parent.appendChild(createDOMNode(vChild));
    });
};

export const patch = (nextVNode: VNodeType, node: DOMNodeType) => {
    const vNode = (node as any).v || recycleNode(node);

    // console.log('patch:', vNode)

    const newNode = patchNode(node, vNode, nextVNode);
    console.log(nextVNode)
    if (newNode) {
        node = newNode;
        (node as any).v = nextVNode;
    }

    return node;
};

const TEXT_NODE_TYPE = 3;

const recycleNode = (node: DOMNodeType) => {
    console.log('recycle:', node)
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
