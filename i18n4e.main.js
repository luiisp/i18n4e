const { getTranslationsPath } = require("./core/files.handler");
const { previousLocalsMiddleware } = require("./core/middleware");


function _getCallerFile() {
  try {
      var err = new Error();
      var callerfile;
      var currentfile;


  Error.prepareStackTrace = function (err, stack) { return stack; };

  currentfile = err.stack.shift().getFileName();

  while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if(currentfile !== callerfile) return callerfile;
  }
} catch (err) {}
return undefined;

}



const i18n4e = {
  languages: {},
  defaultLang: "en",
  path: "/i18n4e/i/translations/",
  middleware: previousLocalsMiddleware,

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
      previousLocalsMiddleware: true,
      i18n4ePath: undefined,
    },
    renderWithDocument = false
  ) => {
    console.log(_getCallerFile())
    import('stack-trace').then((StackTrace) => {
      const caller = StackTrace.get()[0].getFileName();
      console.log("caller", caller);
      const callerPathParts = caller.split("\\");
      const callerPathPartsNoLast = callerPathParts.slice(0, -1);
      const finalPath = callerPathPartsNoLast.join("\\");

      
    if (customPreferences.defaultLang) {
      i18n4e.defaultLang = customPreferences.defaultLang;
    }

    if (customPreferences.langsFolder) {
      customPreferences.langsFolder = finalPath + customPreferences.langsFolder;
    }else{
      customPreferences.langsFolder = finalPath + "/langs";
    }

    if (!customPreferences.previousLocalsMiddleware) {
      app.use(i18n4e.middleware);
      return;
    }

    console.log("PREFERENCEs", customPreferences);

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

      
      console.log("callerDir", finalPath);
    }).catch((error) => {
      console.error(error);
    });


  },
};




module.exports = i18n4e;
