import express, { Request, Response, NextFunction } from 'express';
import { I18n4e } from './interfaces';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cheerio from 'cheerio';
import { serverSideConfigs } from './server-side.config';


export const i18nServerSideMiddlewareWrapper = (app: express.Application, i18n4e: I18n4e) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const originalRender = res.render;
    console.log('i18nServerSideMiddlewareWrapper ..  i18n4e->', i18n4e);

    res.render = function (view: string, options?: object, callback?: (err: Error, html: string) => void) {
      const renderCallback = (err: Error, html: string) => {
        if (err) {
          return res.status(500).send(err.message);
        }

        const $ = cheerio.load(html);
        console.log("possible res ", $);
        $('[i18nID]').each((index, element) => {
         console.log('element', element);
        });
        res.send($.html());
      };

      if (typeof options === 'function') {
        originalRender.call(this, view, renderCallback);
      } else {
       originalRender.call(this, view,[options, serverSideConfigs]);
      }
    };

    next();
  });
};