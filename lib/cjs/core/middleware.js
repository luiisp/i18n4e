"use strict";
const createPreviousLocalsMiddleware = (req, res, next, i18n4e) => {
    res.locals.i18n4e = i18n4e;
    //  res.locals.i18n4e = {
    //    languages: langs,
    //    defaultLang: defaultLang,
    //    path: path,
    //    languagesFiles: languagesFiles,
    //  }
    next();
};
//  console.log("createPreviousLocalsMiddleware (langs) -> ", langs);
//  console.log("createPreviousLocalsMiddleware (defaultLang) -> ", defaultLang);
//  console.log("createPreviousLocalsMiddleware (path) -> ", path);
//  console.log("createPreviousLocalsMiddleware (languagesFiles) -> ", languagesFiles);
module.exports = {
    createPreviousLocalsMiddleware,
};
