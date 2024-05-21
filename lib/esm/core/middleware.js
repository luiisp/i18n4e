"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapperPreviousLocalsMiddleware = void 0;
const wrapperPreviousLocalsMiddleware = (args) => {
    return (req, res, next) => {
        res.locals.i18n4e = {
            languagesFilesPath: args.i18n4e.langsFilesPath,
            defaultLang: args.i18n4e.defaultLang,
            path: args.i18n4e.path,
        };
        next();
    };
};
exports.wrapperPreviousLocalsMiddleware = wrapperPreviousLocalsMiddleware;
