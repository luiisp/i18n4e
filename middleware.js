
const previousLocalsMiddleware = (req, res, next) => {
    res.locals.i18n4e = {
      languages: Object.keys(i18n4e.languages),
      defaultLang: i18n4e.defaultLang,
      path: i18n4e.path,
      languagesFiles: i18n4e.languages,
    };

    next();
  };


module.exports = {
    previousLocalsMiddleware,
}