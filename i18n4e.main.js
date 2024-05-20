const process = require('process');
const { getTranslationsPath } = require("./core/files.handler");
const { previousLocalsMiddleware } = require("./core/middleware");
const { createMainTranslationsRoute } = require("./core/route");

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
  path: "/i18n4e/i/translations",
  middleware: previousLocalsMiddleware,

  init: (
    app,
    customPreferences = {
      defaultLang: undefined,
      langsFolder: undefined,
      mainFile: undefined,
      extraFiles: undefined,
      previousLocalsMiddleware: true,
      i18n4ePath: undefined,
    },
    renderWithDocument = false
  ) => {



      const caller = _getCallerFile();
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



    return getTranslationsPath(customPreferences)
      .then((returnValues) => {
        
        i18n4e.languages = returnValues;
        console.log("i18n4e languages loaded", returnValues);

      //  if (customPreferences.previousLocalsMiddleware) {
      //    app.use(i18n4e.middleware);
      //    }


      createMainTranslationsRoute(app,i18n4e.languages,i18n4e.path,i18n4e.defaultLang);
        console.log("Returned Values",returnValues);
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




module.exports = i18n4e;
