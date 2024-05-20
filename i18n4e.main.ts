import * as process from 'process';
import * as express from 'express';
import { createMainTranslationsRoute } from './core/route';
import { getLanguagesFilesPaths } from './core/files.handler';
import { options as optionsInterface, I18n4e } from './core/interfaces';

const i18n4e: I18n4e = {
  langsFilesPath: {},
  defaultLang: 'en',
  path: '/i18n4e/i/translations',
  init: (
    app: any,
    options: optionsInterface = {
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
          languages: i18n4e.langsFilesPath,
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
      .then((filesPaths: any) => {
        i18n4e.langsFilesPath = filesPaths;

        console.log('Returned Values', filesPaths);
        return filesPaths;
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
