import { deepEqual } from "modules/objectsManipulation";

type PropType = Function | null | boolean | string | undefined;

type PropsType = { [key: string]: PropType };

type ChildType = VNodeType | string | undefined | null | boolean;

// type FunctionComponent = (props: PropsType, children: ChildType[]) => VNodeType;

type TagNameFuncType<TProps> = (props: TProps, ...children: ChildType[]) => VNodeType;
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

let stateQueue: (() => void)[] = [];

let didMountInstaces: Component[] = [];

export abstract class Component<TProps extends any = any, TState = {}> {
    context: unknown;
    props: TProps;
    #state: TState;
    refs: any;

    constructor(props: TProps) {
        this.#state = {} as TState;
        this.props = props;
    }

    setState(newState: TState) {
        this.#state = newState;
        patchVDOM();
    }

    get state() {
        return this.#state;
    }

    set state(newState: TState) {
        this.#state = newState;
    }

    didCreate() {}

    didMount() {}

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
        didMountInstaces = [];
        rootVDOM.root = patch(rootVDOM.renderFunc() as unknown as VNodeType, rootVDOM.root);
        didMountInstaces.forEach((instance) => instance.didMount());
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
    didMountInstaces = [];
    rootVDOM = {
        root: patch(renderFunc() as unknown as VNodeType, root),
        renderFunc,
        isRerendering: false,
        needRerender: false,
    };
    didMountInstaces.forEach((instance) => instance.didMount());
};

export const JSXToVNode = (jsx: JSX.Element): TagVNodeType => jsx as unknown as TagVNodeType;

export namespace VDOM {
    export const createVNode = <T extends Component<TProps>, TProps extends PropsType = PropsType>(
        tagName: TagNameType<T, TProps>,
        props: TProps = {} as TProps,
        ...children: ChildType[]
    ): VNodeType => {
        if (typeof tagName === "function") {
            try {
                const result: VNodeType = (tagName as TagNameFuncType<TProps>)({ ...props, children });
                return result;
            } catch {
                const instance = new (tagName as ComponentConstructor<T, TProps>)({ ...props, children });
                const jsx = JSXToVNode(instance.render());
                // if (Array.isArray(jsx)) {
                //     (jsx as any)._instance = instance;
                //     return jsx;
                // }
                let vnode: ComponentVNodeType = { tagName: tagName.name, props, children, _instance: instance };
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
        typeof vNode === "string" || typeof vNode === "boolean" || typeof vNode === "undefined" || vNode === null
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
        if (isNodeTypeComponent(child)) {
            convertComponentToTag(child);
        }
        node.appendChild(createDOMNode(child));
    });

    if (isNodeTypeComponent(vNode)) {
        vNode._instance.didCreate();
        didMountInstaces.push(vNode._instance);
    }

    return node;
};

const convertComponentToTag = (vNode: ComponentVNodeType) => {
    const newVNode = JSXToVNode(vNode._instance.render());
    vNode.tagName = newVNode.tagName;
    vNode.props = newVNode.props;
    vNode.children = newVNode.children;
};

const tryPatchComponent = (vNode: VNodeType, nextVNode: VNodeType): boolean => {
    if (isNodeTypeComponent(nextVNode)) {
        let isPropsChanged = false;
        if (isNodeTypeComponent(vNode)) {
            if (vNode._instance.constructor.name !== nextVNode._instance.constructor.name) {
                // console.log(vNode._instance.constructor.name, nextVNode._instance.constructor.name);
            } else {
                isPropsChanged = !deepEqual(vNode._instance.props, nextVNode._instance.props);
                vNode._instance.props = nextVNode._instance.props;
                nextVNode._instance = vNode._instance;
            }
        }
        convertComponentToTag(nextVNode);
        return isPropsChanged;
    }
    return false;
};

export const patchNode = (node: DOMNodeType, vNode: VNodeType, nextVNode: VNodeType) => {
    // TODO ???
    // if (nextVNode === undefined) {
    //     node.remove();
    //     return;
    // }

    const isComponentPropsChanged = tryPatchComponent(vNode, nextVNode);

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

    if (isNodeTypeComponent(vNode) && isComponentPropsChanged) {
        vNode._instance.willUpdate();
    }

    patchProps(node, vNode.props, nextVNode.props);
    if (noStopPatch(nextVNode.props)) {
        patchChildren(node, vNode.children, nextVNode.children);
    }

    if (isNodeTypeComponent(nextVNode) && isComponentPropsChanged) {
        nextVNode._instance.didUpdate();
    }

    return node;
};

const isStopPatch = (props: PropsType) => {
    if (props === null) {
        return false;
    }
    if (props.stopPatch === true || props.dangerouslySetInnerHTML !== undefined) {
        return true;
    }
    return false;
};

const noStopPatch = (props: PropsType) => {
    return !isStopPatch(props);
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

const isAlwaysPatchPropKey = (key: string) => {
    return key === "dangerouslySetInnerHTML" || key === "referTo";
};

const patchProp = (node: DOMNodeType, key: string, value: PropType, nextValue: PropType) => {
    if (key === "dangerouslySetInnerHTML") {
        if ((node as HTMLElement).innerHTML !== (nextValue as any).__html) {
            (node as HTMLElement).innerHTML = (nextValue as any).__html;
        }
        return;
    }

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

    (node as HTMLElement).setAttribute(key, nextValue.toString());
};

const patchProps = (node: DOMNodeType, props: PropsType | null, nextProps: PropsType | null) => {
    const mergedProps = { ...props, ...nextProps };

    Object.keys(mergedProps).forEach((key) => {
        if (props === null || nextProps === null || isAlwaysPatchPropKey(key) || props[key] !== nextProps[key]) {
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

    for (let i = vChildren.length; i < nextVChildren.length; i++) {
        if (isNodeTypeComponent(nextVChildren[i])) {
            //if ((nextVChildren[i] as ComponentVNodeType).tagName.toLowerCase() === "hoveredimg")
            convertComponentToTag(nextVChildren[i] as ComponentVNodeType);
        }

        parent.appendChild(createDOMNode(nextVChildren[i]));
    }

    // nextVChildren.slice(vChildren.length).forEach((vChild, i) => {
    //     vChildren.length + i;
    //     parent.appendChild(createDOMNode(vChild));
    // });

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
    const newVNode = VDOM.createVNode(tagName, {}, children as any);
    if (isNodeTypeComponent(newVNode)) {
        convertComponentToTag(newVNode);
    }
    return newVNode;
};

function listener(this: any, event: Event) {
    return this[event.type](event);
}
