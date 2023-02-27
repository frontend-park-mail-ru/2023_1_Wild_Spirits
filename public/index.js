import registerHelpers from "./handlebarsHelpers.js";
import { App } from "./components/App.js";

registerHelpers(Handlebars);

const root = document.getElementById("app");
const app = new App(root);
app.rerender();
