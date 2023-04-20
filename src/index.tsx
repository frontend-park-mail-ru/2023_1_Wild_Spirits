// import { App } from "components/App";
// import { ajax } from "modules/ajax";
// import config from "config";
// import "@style";

// import { store } from "flux";
// import { router } from "modules/router";

// if ("serviceWorker" in navigator) {
//     navigator.serviceWorker.register("sw.js", { scope: "/" }).catch(() => {
//         console.log("register error");
//     });
// }

// ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });
// ajax.host = config.HOST;

// const root = document.getElementById("app");
// const app = new App(root as HTMLElement);

// store.subscribe(() => app.rerender());
// router.subscribe(() => app.rerender());

// app.rerender();

//

import { patch, createVNode as cvn, VNodeType, DOMNodeType, Component } from "./modules/vdom";

const createVNode = cvn;

/*
const createVButton = props => {
  const { text, onclick } = props;
  return createVNode("button", { onclick }, [text]);
};
const createVApp = store => {
  const { count } = store.state;
  return createVNode("div", { class: "container", "data-count": count }, [
    createVNode("h1", {}, ["Hello, Virtual DOM"]),
    createVNode("div", {}, [`Count: ${count}`]),
    "Text node without tags",
    createVNode("img", { src: "https://i.ibb.co/M6LdN5m/2.png", width: 200 }),
    createVNode("div", {}, [
      createVButton({
        text: "-1",
        onclick: () => store.setState({ count: store.state.count - 1 })
      }),
      " ",
      createVButton({
        text: "+1",
        onclick: () => store.setState({ count: store.state.count + 1 })
      })
    ])
  ]);
};
*/

class TestComponent extends Component {
    render() {
        return <div>TestComponent!</div>;
    }
}

type TestFooProps = { test: string };
const TestFoo = ({ test }: TestFooProps) => {
    return <div>TestFoo!</div>;
};

const createVApp = (store: any) => {
    const { count } = store.state;
    const decrement = () => store.setState({ count: store.state.count - 1 });
    const increment = () => store.setState({ count: store.state.count + 1 });

    return (
        <div {...{ class: "container", "data-count": String(count) }}>
            <h1>Hello, Virtual DOM</h1>
            <div>Count: {String(count)}</div>
            <TestFoo test="test" />
            <TestComponent />
            Text node without tags
            <img src="https://i.ibb.co/M6LdN5m/2.png" width="200" />
            {count > -5 ? <button onClick={decrement}>-1</button> : ""}
            {count < 5 && <button onClick={increment}>+1</button>}
        </div>
    );
};

const store = {
    state: { count: 0 },
    onStateChanged: () => {},
    setState(nextState: any) {
        this.state = nextState;
        this.onStateChanged();
    },
};

console.log(createVApp(store));

let app = patch(createVApp(store) as unknown as VNodeType, document.getElementById("app") as DOMNodeType);

store.onStateChanged = () => {
    app = patch(createVApp(store) as unknown as VNodeType, app);
};
