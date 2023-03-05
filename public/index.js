import registerHelpers from "./handlebarsHelpers.js";
import { App } from "./components/App.js";
import { Ajax } from "./modules/ajax.js";
import config from "./config.js";

window.ajax = new Ajax();
window.ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });
window.ajax.host = config.HOST;

// eslint-disable-next-line no-undef
registerHelpers(Handlebars);

const root = document.getElementById("app");
const app = new App(root);
app.rerender();
