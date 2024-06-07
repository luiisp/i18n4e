import express, { Request, Response } from 'express';
import * as path from 'path';
import { returnVarTranslationsFromFiles } from './files.handler';



export const startLangsNameInPath = (app: express.Application, args: any) => {
   // const routesArr = app._router.stack;
//	routesArr.map((route: any) => {
//		if (route.route) {
//
//		}
//	});


	app.get(`${args.i18n4e.path}/`, (req: Request, res: Response) => {

		return res.status(404).json({ message: 'Not found' });
	});
};