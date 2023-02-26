const fs = require("fs");
const path = require("path");
const debug = require("debug");
const log = debug("server");
let Handlebars = require("handlebars");

const templatePath = "./public/templates";
const componentsPath = "./public/compiled";

function checkAndCreateDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

function compileComponents(tempDirPath, compDirPath) {
    checkAndCreateDir(compDirPath);

    const fileNames = fs.readdirSync(tempDirPath);

    for (const fileName of fileNames) {
        const filePath = path.join(tempDirPath, fileName);

        if (fs.lstatSync(filePath).isFile()) {
            log("precompiling " + filePath);

            const template = fs.readFileSync(filePath).toString();

            const compiled = `export default Handlebars.template(${Handlebars.precompile(template)});`;

            const componentPath = path.join(compDirPath, fileName + ".js");

            fs.writeFileSync(componentPath, compiled);
        } else if (fs.lstatSync(filePath).isDirectory()) {
            compileComponents(filePath, path.join(compDirPath, fileName));
        }
    }
}

compileComponents(templatePath, componentsPath);
