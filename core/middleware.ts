import express, { Request, Response, NextFunction } from 'express';
import { I18n4e } from './interfaces';


export const i18nServerSideMiddlewareWrapper = (app: express.Application, i18n4e: I18n4e) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const originalRender = res.render;
    console.log('i18nServerSideMiddlewareWrapper ..  i18n4e->', i18n4e);

    next();
  });
};
