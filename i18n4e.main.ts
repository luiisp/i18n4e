import * as process from "process";
import { getTranslationsPath } from "./core/files.handler";
import { createPreviousLocalsMiddleware } from "./core/middleware";
import { createMainTranslationsRoute } from "./core/route";

interface CustomPreferences {
  defaultLang?: string;
  langsFolder?: string;
  mainFile?: string;
  extraFiles?: string;
  previousLocalsMiddleware?: boolean;
  path?: string;
}

interface I18n4e {
  languages: any; // You might want to replace `any` with a specific type
  defaultLang: string;
  path: string;
  init: (
    app: any, // You might want to replace `any` with a specific type
    customPreferences?: CustomPreferences,
    renderWithDocument?: boolean
  ) => Promise<any>; // You might want to replace `any` with a specific type
}

const i18n4e: I18n4e = {
  languages: {},
  defaultLang: "en",
  path: "/i18n4e/i/translations",
  init: (
    app: any, 
    customPreferences: CustomPreferences = {
      defaultLang: undefined,
      langsFolder: undefined,
      mainFile: undefined,
      extraFiles: undefined,
      previousLocalsMiddleware: true,
      path: undefined,
    },
    renderWithDocument: boolean = false
  ): Promise<any> => {
    if (customPreferences.defaultLang)
      i18n4e.defaultLang = customPreferences.defaultLang;

    if (customPreferences.path) i18n4e.path = customPreferences.path;

    if (customPreferences.previousLocalsMiddleware) {
      app.use((req: any, res: any, next: any) => {
        res.locals.i18n4e = {
          languages: i18n4e.languages,
          defaultLang: i18n4e.defaultLang,
          path: i18n4e.path,
        };
        next();
      });
    }

    const caller = (i18n4e.init as any).caller.toString();
    console.log("caller", caller);
    const callerPathParts = caller?.split("\\");
    const callerPathPartsNoLast = callerPathParts?.slice(0, -1);
    const finalPath = callerPathPartsNoLast?.join("\\");

    if (customPreferences.langsFolder) {
      customPreferences.langsFolder = finalPath + customPreferences.langsFolder;
    } else {
      customPreferences.langsFolder = finalPath + "/_locales";
    }

    return getTranslationsPath(customPreferences)
      .then((returnValues: any) => {
        i18n4e.languages = returnValues;

        createMainTranslationsRoute(
          app,
          i18n4e.languages,
          i18n4e.path,
          i18n4e.defaultLang
        );
        console.log("Returned Values", returnValues);
        return returnValues;
      })
      .catch((err: Error) => {
        const messageError = `\x1b[3m\x1b[34m[i18n4e\x1b[0m \x1b[31m\x1b[1mError\x1b[0m \x1b[3m\x1b[34m(On Init)]\x1b[0m  \x1b[33m-->\x1b[0m \x1b[31m\x1b[1m${err.message}\x1b[0m`;
        console.error(messageError);
        throw new Error("i18n4e (Init Error)");
      });

    console.log("callerDir", finalPath);
  },
};

export default i18n4e;
