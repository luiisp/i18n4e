import express, { Request, Response } from 'express';


export const wrapperAddTranslationsRoute = (app: express.Application,args: any) => {

  app.get(`${args.i18n4e.path}/`, (req: Request, res: Response) => {

    let requestedFiles: string[] = (req.query.files as Array<string>) || [];
    let lang: string = (req.query.lang as string) || args.i18n4e.defaultLang;

    console.log( "requestedFiles", requestedFiles);
    console.log( "lang", lang);

    return res.status(404).json({ message: 'Not found' });
  
  });

};
