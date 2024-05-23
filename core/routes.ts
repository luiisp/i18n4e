import express, { Request, Response } from 'express';
import * as path from 'path';
import { returnVarTranslationsFromFiles } from './files.handler';

export const wrapperAddTranslationsRoute = (app: express.Application, args: any) => {
	app.get(`${args.i18n4e.path}/`, (req: Request, res: Response) => {
		let requestedFiles: string[] = [];
		let requestedFilesStr: string = (req.query.files as string) || '';
		let lang: string = (req.query.lang as string) || args.i18n4e.defaultLang;
		if (lang.toLowerCase() !== args.i18n4e.defaultLang && !args.i18n4e.langsFilesPath[lang]) {
			lang = args.i18n4e.defaultLang;
		}

		const mainFilePath = args.i18n4e.langsFilesPath[lang][0];

		requestedFiles = [mainFilePath];

		if (requestedFilesStr !== '') {
			const mainFileFolder = path.dirname(mainFilePath);
			let requestedFilesSplited: string[] = requestedFilesStr.split(' ');
			requestedFilesSplited.forEach((file) => {
				const possiblePath = path.join(mainFileFolder, file + '.json');
				if (args.i18n4e.langsFilesPath[lang].includes(possiblePath)) {
					requestedFiles.push(possiblePath);
				}
			});
		}

		if (requestedFiles.length === 0) {
			return res.status(404).json({ message: 'Not found' });
		}

		return res.status(200).json(returnVarTranslationsFromFiles(requestedFiles));
	});
};
