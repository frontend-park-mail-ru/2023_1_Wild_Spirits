import fs from 'fs';
import path from 'path';
import debug from 'debug';
import Handlebars from 'handlebars';

import registerHelpers from '../public/handlebarsHelpers.js';

const log = debug('server');

registerHelpers(Handlebars);

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
            try {
                compileTemplate(path.join(from, fileName), path.join(to, fileName + '.js'));
            } catch (e) {
                log(e);
            }
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
