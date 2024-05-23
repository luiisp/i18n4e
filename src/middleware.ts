import express, { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { I18n4e } from './interfaces';
import cheerio from 'cheerio';
import { serverSideConfigs } from './server-side.config';

export const i18nServerSideMiddlewareWrapper = (app: express.Application, i18n4e: I18n4e) => {
	app.use((req: Request, res: Response, next: NextFunction) => {
		console.log('Middleware called');
		const originalRender = res.render.bind(res);

		res.render = (
			view: string,
			options: any,
			callback?: (err: Error, html: string) => void
		) => {
			console.log('Rendering view: ', view);

			let extraFiles: string[] = [];
			if (serverSideConfigs.extraFiles) {
				const viewName = serverSideConfigs.extraFiles.find((file) => file.name === view);
				if (viewName) {
					extraFiles = viewName.files;
					console.log('Extra files found: ', viewName);
				}
			}

			originalRender(view, options, (err, html) => {
				if (err) return next(err);
				const $ = cheerio.load(html);
				let userLang = (
					req.headers['accept-language']
						? req.headers['accept-language'].split(',')[0]
						: i18n4e.defaultLang
				).replace('-', '_');
				if (
					userLang.toLowerCase() !== i18n4e.defaultLang &&
					!i18n4e.langsFilesPath[userLang]
				) {
					userLang = i18n4e.defaultLang;
				}

				$('html').attr('lang', userLang);
				const requestedLangArray = i18n4e.langsFilesPath[userLang];
				const mainFilePath = requestedLangArray[0];

				const mainFile = JSON.parse(fs.readFileSync(mainFilePath, 'utf8'));
				console.log('Main file: ', mainFile);
				for (const key in mainFile) {
					$('[i18nID="' + key + '"]').text(mainFile[key].message);
				}
				console.log('User language: ', userLang);

				//   const i18nIDs = $('[i18nID]')
				//   i18nIDs.each((index, element) => {
				//     $(element).text("TEste");
				//     $(element).removeAttr('i18nID');
				//   });

				//    console.log(i18nIDs)

				//    console.log("1 HTML:\n", html);
				//    console.log("2 HTML:\n", $.html());

				res.send($.html());
			});

			next();
		};
	});
};
