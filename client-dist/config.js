"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncWithServerTypes = exports.routesNames = exports.localStorageLangKey = exports.i18n4eMainRouteName = void 0;
exports.i18n4eMainRouteName = "/i18n4e/client/d/main";
exports.localStorageLangKey = "i18n4eLang";
exports.routesNames = {
    "getLangs": exports.i18n4eMainRouteName + "/get-langs",
    "setLang": exports.i18n4eMainRouteName + "/set-lang",
    "unsetLang": exports.i18n4eMainRouteName + "/unset-lang",
};
exports.syncWithServerTypes = {
    "setLang": { path: exports.routesNames.setLang, method: "POST" },
    "unsetLang": { path: exports.routesNames.unsetLang, method: "GET" },
};
