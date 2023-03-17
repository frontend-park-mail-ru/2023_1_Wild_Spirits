/** @module server */

import fs from "fs";
import path from "path";
import debug from "debug";
import Handlebars from "handlebars";

import registerHelpers from "../src/handlebarsHelpers.js";

const log = debug("server");

registerHelpers(Handlebars);

/**
 * check the existance of directory; creates it if it doesn't exist
 * @param {path} dirPath - path to the directory
 */
function checkAndCreateDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

/**
 * compiles templates
 * @param {path} tempPath - path to directory with templates
 * @param {path} compPath - path to directory with compiled templates
 */
function compileTemplate(tempPath, compPath) {
    log("rendering", tempPath, "to", compPath);

    const template = fs.readFileSync(tempPath).toString();
    const compiled = `export default Handlebars.template(${Handlebars.precompile(template)});`;
    fs.writeFileSync(compPath, compiled);
}

/**
 * traverses directory and handles all found files
 * @param {path} tempDirPath
 * @param {path} compDirPath
 * @callback callback - file handler
 */
function traverseComponents(tempDirPath, compDirPath, callback) {
    checkAndCreateDir(compDirPath);
    const fileNames = fs.readdirSync(tempDirPath);

    for (const fileName of fileNames) {
        const filePath = path.join(tempDirPath, fileName);
        if (fs.lstatSync(filePath).isFile()) {
            callback(tempDirPath, compDirPath, fileName);
        } else if (fs.lstatSync(filePath).isDirectory()) {
            traverseComponents(filePath, path.join(compDirPath, fileName), callback);
        }
    }
}

/**
 * starts watching files in tempDir; compiles them if change detected
 * @param {path} tempDirPath
 * @param {path} compDirPath
 */
function watchComponents(tempDirPath, compDirPath) {
    traverseComponents(tempDirPath, compDirPath, (from, to, fileName) => {
        const filePath = path.join(from, fileName);
        fs.watch(filePath, (_, fileName) => {
            try {
                compileTemplate(path.join(from, fileName), path.join(to, fileName + ".js"));
            } catch (error) {
                log(error);
            }
        });
    });
}

/**
 * compiles all templates from tempDir to compDir saving the hierarchy
 * @param {path} tempDirPath
 * @param {path} compDirPath
 */
function compileComponents(tempDirPath, compDirPath) {
    traverseComponents(tempDirPath, compDirPath, (from, to, fileName) => {
        compileTemplate(path.join(from, fileName), path.join(to, fileName + ".js"));
    });
}

export { watchComponents, compileComponents };
