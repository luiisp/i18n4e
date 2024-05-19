const { getTranslationsPath } = require("./files.handler");
const { previousLocalsMiddleware } = require("./middleware");

const i18n4e = {
  languages: {},
  defaultLang: "en",
  path: "/i18n4e/i/translations/",
  middleware: previousLocalsMiddleware, // Removido a chamada de função

  route: () => {
    return (req, res) => {
      let lang = req.query.lang;
      if (!lang) {
        return res.status(404).json({ message: "Not found" });
      }

      let translations = require(i18n4e.languages[lang]);

      if (!translations) {
        lang = i18n4e.defaultLang;
      }

      translations = require(i18n4e.languages[lang]);

      if (!lang || !translations) {
        return res.status(404).json({ message: "Not found" });
      }

      res.json(translations);
    };
  },

  init: (
    app,
    customPreferences = {
      defaultLang: undefined,
      langsFolder: undefined,
      mainFile: undefined,
      files: undefined,
      renderBeforeEjs: false,
      previousLocalsMiddleware: false,
      i18n4ePath: undefined,
    }
  ) => {
    if (customPreferences.defaultLang) {
      i18n4e.defaultLang = customPreferences.defaultLang;
    }

    if (customPreferences.i18n4ePath) {
      i18n4e.path = customPreferences.i18n4ePath;
    }

    

    if (!customPreferences.previousLocalsMiddleware) {
      app.use(i18n4e.middleware);
      return;
    }

    return getTranslationsPath(customPreferences)
      .then((returnValues) => {

        app.use(`${i18n4e.path}/`, i18n4e.route());
        i18n4e.languages = returnValues;
        console.log("i18n4e languages loaded", returnValues);
        app.use(i18n4e.middleware); 
        return returnValues;
      })
      .catch((err) => {
        console.error(err);
        return undefined;
      });
  },
};

module.exports = i18n4e;
