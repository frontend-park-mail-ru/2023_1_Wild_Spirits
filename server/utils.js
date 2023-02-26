// const fs = require('fs');
// const path = require('path')
// const debug = require('debug');
// const log = debug('server');
// let Handlebars = require("handlebars");

import fs from 'fs';
import path from 'path';
import debug from 'debug';
import Handlebars from 'handlebars';

const log = debug('server');

function checkAndCreateDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

function compileTemplate(tempPath, compPath) {

    log('rendering', tempPath, 'to', compPath);

    const template = fs.readFileSync(tempPath).toString();
    const compiled = `export default Handlebars.template(${Handlebars.precompile(template)});`;
    fs.writeFileSync(compPath, compiled);
}

function traverseComponents(tempDirPath, compDirPath, callback) {
    checkAndCreateDir(compDirPath);
    const fileNames = fs.readdirSync(tempDirPath);

    for (const fileName of fileNames) {
        const filePath = path.join(tempDirPath, fileName);
        if (fs.lstatSync(filePath).isFile()) {
            callback(tempDirPath, compDirPath, fileName);
        } else if (fs.lstatSync(filePath).isDirectory()){
            traverseComponents(filePath, path.join(compDirPath, fileName), callback);
        }
    }
}

function watchComponents(tempDirPath, compDirPath) {
    traverseComponents(tempDirPath, compDirPath, (from, to, fileName) => {
        const filePath = path.join(from, fileName);
        fs.watch(filePath, (_, fileName) => {
            compileTemplate(path.join(from, fileName), path.join(to, fileName + '.js'));
        });  
    });
}

function compileComponents(tempDirPath, compDirPath) {
    traverseComponents(tempDirPath, compDirPath, (from, to, fileName) => {
        const filePath = path.join(from, fileName);
        compileTemplate(path.join(from, fileName), path.join(to, fileName + '.js'));
    });
}

export {watchComponents, compileComponents};