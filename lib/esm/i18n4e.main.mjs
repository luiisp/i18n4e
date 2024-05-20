"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_handler_1 = require("./core/files.handler");
const i18n4e = {
    langsFilesPath: {},
    defaultLang: 'en',
    path: '/i18n4e/i/translations',
    init: (app, options = {
        defaultLang: undefined,
        langsFolder: undefined,
        mainFile: undefined,
        extraFiles: undefined,
        previousLocalsMiddleware: true,
        path: undefined,
    }, renderWithDocument = false) => {
        if (options.defaultLang)
            i18n4e.defaultLang = options.defaultLang;
        if (options.path)
            i18n4e.path = options.path;
        if (options.previousLocalsMiddleware) {
            app.use((req, res, next) => {
                res.locals.i18n4e = {
                    languages: i18n4e.langsFilesPath,
                    defaultLang: i18n4e.defaultLang,
                    path: i18n4e.path,
                };
                next();
            });
        }
        const caller = i18n4e.init.caller.toString();
        console.log('caller', caller);
        const callerPathParts = caller?.split('\\');
        const callerPathPartsNoLast = callerPathParts?.slice(0, -1);
        const finalPath = callerPathPartsNoLast?.join('\\');
        if (options.langsFolder) {
            options.langsFolder = finalPath + options.langsFolder;
        }
        else {
            options.langsFolder = finalPath + '/_locales';
        }
        return (0, files_handler_1.getLanguagesFilesPaths)(options)
            .then((filesPaths) => {
            i18n4e.langsFilesPath = filesPaths;
            console.log('Returned Values', filesPaths);
            return filesPaths;
        })
            .catch((err) => {
            const messageError = `\x1b[3m\x1b[34m[i18n4e\x1b[0m \x1b[31m\x1b[1mError\x1b[0m \x1b[3m\x1b[34m(On Init)]\x1b[0m  \x1b[33m-->\x1b[0m \x1b[31m\x1b[1m${err.message}\x1b[0m`;
            console.error(messageError);
            throw new Error('i18n4e (Init Error)');
        });
        console.log('callerDir', finalPath);
    },
};
exports.default = i18n4e;
