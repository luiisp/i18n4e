import express, { Request, Response, NextFunction } from 'express';

export const i18nServerSideMiddlewareWrapper = (args: any) => {
  args.app.use((req: Request, res: Response, next: NextFunction) => {
    const originalRender = res.render;

    next();
  });
};
