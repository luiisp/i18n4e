import express, { Request, Response } from 'express';
import { langsFilesPath } from './interfaces';

const createMainTranslationsRoute = (
  app: express.Application,
  values: langsFilesPath,
  path: string,
  defaultLang: string
) => {
  console.log('createMainTranslationsRoute', values);
  console.log('createMainTranslationsRoute', path);
  console.log('createMainTranslationsRoute', defaultLang);

  app.get(`${path}/`, (req: Request, res: Response) => {
    let requestedFiles: string[];
    let lang: string = (req.query.lang as string) || defaultLang;
    let requestedFilesQuery: string | undefined = req.query
      .extrafiles as string;

    if (requestedFilesQuery) {
      requestedFiles = requestedFilesQuery.split('/');
    }

    let translationsFilesListPath: string[] = values[lang];
    if (!requestedFilesQuery) {
      requestedFiles = [translationsFilesListPath[0]];
    }

    return res.status(404).json({ message: 'Not found' });
  });
};

export { createMainTranslationsRoute };
