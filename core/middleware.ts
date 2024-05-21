import express, { Request, Response, NextFunction } from 'express';

export const wrapperPreviousLocalsMiddleware = (args: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals.i18n4e = {
      languagesFilesPath: args.i18n4e.langsFilesPath,
      defaultLang: args.i18n4e.defaultLang,
      path: args.i18n4e.path,
    };
    next();
  };
};
