import express, { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { I18n4e } from './interfaces';
import cheerio from 'cheerio';
import { serverSideConfigs } from './server-side.config';
import NodeCache from 'node-cache';

export const i18nServerSideMiddlewareWrapper = (app: express.Application, i18n4e: I18n4e) => {
	const htmlCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

	app.use((req: Request, res: Response, next: NextFunction) => {
		const originalRender = res.render.bind(res);
		let userLang: string;

		if (req.headers['accept-language']) {
			userLang = req.headers['accept-language'].split(',')[0].toLowerCase();
			userLang = userLang.replace('-', '_');
		} else {
			userLang = i18n4e.defaultLang;
		}

		res.render = (
			view: string,
			options: any,
			callback?: (err: Error, html: string) => void
		) => {
			let err: Error | null = null;
			if (err) return next(err);

			const cacheKey = `${view}-${userLang}`;
			const cachedHtml = htmlCache.get(cacheKey);
			if (cachedHtml) {
				return res.send(cachedHtml as string);
			}

			let extraFiles: string[] = [];
			if (serverSideConfigs.extraFiles && serverSideConfigs.extraFiles.length > 0) {
				const viewName = serverSideConfigs.extraFiles.find((file) => file.view === view);
				if (viewName) {
					extraFiles = viewName.files;
				}
			}

			originalRender(view, options, (err, html) => {
				if (err) return next(err);
				const $ = cheerio.load(html);

				$('html').attr('lang', userLang);
				let requestedLangArray = i18n4e.langsFilesPath[userLang];

				if (!requestedLangArray || requestedLangArray.length == 0) {
					userLang = i18n4e.defaultLang;
					requestedLangArray = i18n4e.langsFilesPath[userLang];
					if (!requestedLangArray) {
						throw new Error('Default language not found');
					}
				}
				const mainFilePath = requestedLangArray[0];
				const actualDir = path.dirname(mainFilePath);

				const mainFile = JSON.parse(fs.readFileSync(mainFilePath, 'utf8'));
				for (const key in mainFile) {
					$('[i18nID="' + key + '"]').text(mainFile[key].message);
				}

				//all extra files
				if (serverSideConfigs.useAllExtraFiles && serverSideConfigs.AllExtraFiles) {
					serverSideConfigs.AllExtraFiles.forEach((file) => {
						const relativePathExtra = path.join(actualDir, file + '.json');

						const extraFile = JSON.parse(fs.readFileSync(relativePathExtra, 'utf8'));
						for (const key in extraFile) {
							$('[i18nID="' + key + '"]').text(extraFile[key].message);
						}
					});
				}

				//extra files
				if (extraFiles && extraFiles.length > 0) {
					extraFiles.forEach((file) => {
						const relativePathExtra = path.join(actualDir, file + '.json');
						const extraFile = JSON.parse(fs.readFileSync(relativePathExtra, 'utf8'));
						for (const key in extraFile) {
							$('[i18nID="' + key + '"]').text(extraFile[key].message);
						}
					});
				}

				const translatedHtml = $.html();
				htmlCache.set(cacheKey, translatedHtml);
				res.send(translatedHtml);
			});
		};
		next();
	});
};
