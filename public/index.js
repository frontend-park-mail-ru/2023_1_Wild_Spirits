import registerHelpers from "./handlebarsHelpers.js";
import { App } from "./components/App.js";
import { Ajax } from "./modules/ajax.js";

window.ajax = new Ajax();
window.ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });
window.ajax.host = "http://95.163.213.222/api";

registerHelpers(Handlebars);

const root = document.getElementById("app");
const app = new App(root);
app.rerender();
