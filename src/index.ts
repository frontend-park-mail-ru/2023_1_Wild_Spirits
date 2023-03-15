import registerHelpers from "handlebarsHelpers";
import { App } from "components/App";
import { Ajax } from "modules/ajax";
import config from "config";

window.ajax = new Ajax();
window.ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });
window.ajax.host = config.HOST;

const root = document.getElementById("app");
const app = new App(root);
app.rerender();
