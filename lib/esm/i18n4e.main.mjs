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
exports.i18n4e = void 0;
const path = __importStar(require("path"));
const files_handler_1 = require("./core/files.handler");
const middleware_1 = require("./core/middleware");
function getCallerFile(position = 2) {
    // credits: https://github.com/stefanpenner/get-caller-file/blob/master/index.ts
    if (position >= Error.stackTraceLimit) {
        throw new TypeError('getCallerFile(position) requires position be less then Error.stackTraceLimit but position was: `' + position + '` and Error.stackTraceLimit was: `' + Error.stackTraceLimit + '`');
    }
    const oldPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const stack = new Error().stack;
    Error.prepareStackTrace = oldPrepareStackTrace;
    if (stack !== null && typeof stack === 'object') {
        return stack[position] ? stack[position].getFileName() : undefined;
    }
}
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
    }, renderBeforeDocument = false) => {
        if (options.defaultLang)
            i18n4e.defaultLang = options.defaultLang;
        if (options.path)
            i18n4e.path = options.path;
        if (options.previousLocalsMiddleware) {
            app.use((0, middleware_1.wrapperPreviousLocalsMiddleware)({ i18n4e }));
        }
        const caller = getCallerFile(2);
        const callerPathParts = caller?.split('\\');
        const callerPathPartsNoLast = callerPathParts?.slice(0, -1);
        const finalPath = callerPathPartsNoLast?.join('\\');
        if (!finalPath)
            throw new Error('i18n4e (Init Error): Unable to get caller path.');
        if (options.langsFolder) {
            options.langsFolder = path.resolve(finalPath || "./", options.langsFolder);
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
            console.error(`\x1b[3m\x1b[34m[i18n4e\x1b[0m \x1b[31m\x1b[1mError\x1b[0m \x1b[3m\x1b[34m(On Init)]\x1b[0m  \x1b[33m-->\x1b[0m \x1b[31m\x1b[1m${err.message}\x1b[0m`);
            throw new Error('i18n4e (Init Error)');
        });
    },
};
exports.i18n4e = i18n4e;
