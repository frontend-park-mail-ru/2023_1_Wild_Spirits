import { ajax } from "modules/ajax";
import config from "config";
import "@style";

import { VDOM, patch, VNodeType, DOMNodeType, createVDOM, patchVDOM } from "./modules/vdom";
import { App } from "components/App";

import { store } from "flux";
import { router } from "modules/router";

// if ("serviceWorker" in navigator) {
//     navigator.serviceWorker.register("sw.js", { scope: "/" }).catch(() => {
//         console.log("register error");
//     });
// }

ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });
ajax.host = config.HOST;

const createVApp = () => {
    return (
        <div>
            <App />
        </div>
    );
};

createVDOM(document.getElementById("app") as HTMLElement, createVApp);

store.subscribe(patchVDOM);
router.subscribe(patchVDOM);
