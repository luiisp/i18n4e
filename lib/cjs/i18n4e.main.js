"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_handler_1 = require("./core/files.handler");
const route_1 = require("./core/route");
function _getCallerFile() {
    var _a, _b;
    try {
        var err = new Error();
        var callerfile;
        var currentfile;
        Error.prepareStackTrace = function (err, stack) {
            return stack;
        };
        currentfile = (_a = err.stack.shift()) === null || _a === void 0 ? void 0 : _a.getFileName();
        while (err.stack.length) {
            callerfile = (_b = err.stack.shift()) === null || _b === void 0 ? void 0 : _b.getFileName();
            if (currentfile !== callerfile)
                return callerfile;
        }
    }
    catch (err) { }
    return undefined;
}
const i18n4e = {
    languages: {},
    defaultLang: "en",
    path: "/i18n4e/i/translations",
    init: (app, // You might want to replace `any` with a specific type
    customPreferences = {}, renderWithDocument = false) => {
        if (customPreferences.defaultLang)
            i18n4e.defaultLang = customPreferences.defaultLang;
        if (customPreferences.path)
            i18n4e.path = customPreferences.path;
        if (customPreferences.previousLocalsMiddleware) {
            app.use((req, res, next) => {
                res.locals.i18n4e = {
                    languages: i18n4e.languages,
                    defaultLang: i18n4e.defaultLang,
                    path: i18n4e.path,
                };
                next();
            });
        }
        const caller = _getCallerFile();
        const callerPathParts = caller === null || caller === void 0 ? void 0 : caller.split("\\");
        const callerPathPartsNoLast = callerPathParts === null || callerPathParts === void 0 ? void 0 : callerPathParts.slice(0, -1);
        const finalPath = callerPathPartsNoLast === null || callerPathPartsNoLast === void 0 ? void 0 : callerPathPartsNoLast.join("\\");
        if (customPreferences.langsFolder) {
            customPreferences.langsFolder = finalPath + customPreferences.langsFolder;
        }
        else {
            customPreferences.langsFolder = finalPath + "/_locales";
        }
        return (0, files_handler_1.getTranslationsPath)(customPreferences)
            .then((returnValues) => {
            i18n4e.languages = returnValues;
            (0, route_1.createMainTranslationsRoute)(app, i18n4e.languages, i18n4e.path, i18n4e.defaultLang);
            console.log("Returned Values", returnValues);
            return returnValues;
        })
            .catch((err) => {
            const messageError = `\x1b[3m\x1b[34m[i18n4e\x1b[0m \x1b[31m\x1b[1mError\x1b[0m \x1b[3m\x1b[34m(On Init)]\x1b[0m  \x1b[33m-->\x1b[0m \x1b[31m\x1b[1m${err.message}\x1b[0m`;
            console.error(messageError);
            throw new Error("i18n4e (Init Error)");
        });
        console.log("callerDir", finalPath);
    },
};
exports.default = i18n4e;
