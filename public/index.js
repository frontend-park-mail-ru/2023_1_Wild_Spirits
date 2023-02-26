import tmp from "./components/smth.handlebars.js";
import nested from "./components/directory/directory/nested.handlebars.js";
import { App } from "./components/App.js";

const root = document.getElementById("app");

// const res = tmp({ test: "TEST" });
// root.innerHTML += res;
// root.innerHTML += nested({ nestedTest: "NESTED TEST" });

const app = new App(root);
app.rerender();
