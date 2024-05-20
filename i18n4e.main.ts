import * as process from 'process';
import * as express from 'express';
import { createMainTranslationsRoute } from './core/route';
import { getLanguagesFilesPaths } from './core/files.handler';
import { options, I18n4e } from './core/interfaces';

const i18n4e: I18n4e = {
  languages: {},
  defaultLang: 'en',
  path: '/i18n4e/i/translations',
  init: (
    app: any,
    options: options = {
      defaultLang: undefined,
      langsFolder: undefined,
      mainFile: undefined,
      extraFiles: undefined,
      previousLocalsMiddleware: true,
      path: undefined,
    },
    renderWithDocument: boolean = false
  ): Promise<any> => {
    if (options.defaultLang) i18n4e.defaultLang = options.defaultLang;

    if (options.path) i18n4e.path = options.path;

    if (options.previousLocalsMiddleware) {
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
    console.log('caller', caller);
    const callerPathParts = caller?.split('\\');
    const callerPathPartsNoLast = callerPathParts?.slice(0, -1);
    const finalPath = callerPathPartsNoLast?.join('\\');

    if (options.langsFolder) {
      options.langsFolder = finalPath + options.langsFolder;
    } else {
      options.langsFolder = finalPath + '/_locales';
    }

    return getLanguagesFilesPaths(options)
      .then((returnValues: any) => {
        i18n4e.languages = returnValues;

        createMainTranslationsRoute(
          app,
          i18n4e.languages,
          i18n4e.path,
          i18n4e.defaultLang
        );
        console.log('Returned Values', returnValues);
        return returnValues;
      })
      .catch((err: Error) => {
        const messageError = `\x1b[3m\x1b[34m[i18n4e\x1b[0m \x1b[31m\x1b[1mError\x1b[0m \x1b[3m\x1b[34m(On Init)]\x1b[0m  \x1b[33m-->\x1b[0m \x1b[31m\x1b[1m${err.message}\x1b[0m`;
        console.error(messageError);
        throw new Error('i18n4e (Init Error)');
      });

    console.log('callerDir', finalPath);
  },
};

export default i18n4e;
