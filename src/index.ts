import "./index.css";
import { App } from "components/App";
import { ajax } from "modules/ajax";
import config from "config";

import { store } from "flux/index";

ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });
ajax.host = config.HOST;

const root = document.getElementById("app");
const app = new App(root as HTMLElement);

store.subscribe(()=>app.rerender());

app.rerender();
