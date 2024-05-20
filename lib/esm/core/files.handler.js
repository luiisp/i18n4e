"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguagesFilesPaths = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const getLanguagesFilesPaths = (options = {}) => {
    const regex = /\/|\\/g;
    const definitions = {
        path: options.langsFolder || '',
        mainFile: options.mainFile || 'translation.json',
        extraFiles: options.extraFiles || [],
    };
    definitions.path = definitions.path.replace(regex, path.sep);
    const langsFolder = path.join(definitions.path);
    console.log('langsFolder', langsFolder);
    return new Promise((resolve, reject) => {
        fs.readdir(langsFolder, (err, files) => {
            if (err) {
                return reject(new Error(`i18n4e languages folder defined as (${definitions.path}) was not found.`));
            }
            const returnValues = {};
            const promises = files.map((file) => {
                return new Promise((resolve, reject) => {
                    const filePath = path.join(langsFolder, file);
                    fs.stat(filePath, (err, stats) => {
                        if (err) {
                            return reject(new Error(`Unable to read i18n4e folder in ${filePath}`));
                        }
                        if (stats.isDirectory()) {
                            const mainTranslationFilePath = path.join(filePath, definitions.mainFile);
                            console.log('mainTranslationFilePath', mainTranslationFilePath);
                            fs.access(mainTranslationFilePath, fs.constants.F_OK, (err) => {
                                if (err) {
                                    return reject(new Error(`The main json file defined as (${definitions.mainFile}) was not found. Expected Path: ${mainTranslationFilePath}`));
                                }
                                else {
                                    returnValues[file] = [mainTranslationFilePath];
                                    if (definitions.extraFiles.length) {
                                        console.log('have extra files');
                                        const extraPromises = definitions.extraFiles.map((extraFile) => {
                                            return new Promise((resolve, reject) => {
                                                const extraFilePath = path.join(filePath, extraFile);
                                                console.log('extraFilePath', extraFilePath);
                                                fs.access(extraFilePath, fs.constants.F_OK, (err) => {
                                                    if (err) {
                                                        return reject(new Error(`The file (${extraFile}) was defined as extra but was not found. Expected Path: ${extraFilePath}`));
                                                    }
                                                    else {
                                                        console.log('found extra file');
                                                        returnValues[file].push(extraFilePath);
                                                        resolve(returnValues);
                                                    }
                                                });
                                            });
                                        });
                                        Promise.all(extraPromises)
                                            .then(() => resolve(returnValues))
                                            .catch(reject);
                                    }
                                    else {
                                        resolve(returnValues);
                                    }
                                }
                            });
                        }
                        else {
                            resolve(returnValues);
                        }
                    });
                });
            });
            Promise.all(promises)
                .then(() => resolve(returnValues))
                .catch((err) => reject(err));
        });
    });
};
exports.getLanguagesFilesPaths = getLanguagesFilesPaths;
