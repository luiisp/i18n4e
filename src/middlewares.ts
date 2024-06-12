import express, { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { I18n4e } from './interfaces';
import cheerio from 'cheerio';
import { serverSideConfigs } from './server-side.config';
import NodeCache from 'node-cache';

export const i18nServerSideMiddlewareWrapper = (
	app: express.Application,
	i18n4e: I18n4e,
	dev: boolean = true
) => {
	const htmlCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

	app.use((req: Request, res: Response, next: NextFunction) => {
		const splitedUrl = req.url.split('/');
		const lastPath = splitedUrl[splitedUrl.length - 1].replace('-', '_');
		let firstPath = req.url.split('/' + lastPath)[0];

		let userLang: string;

		if (req.headers['accept-language']) {
			userLang = req.headers['accept-language'].split(',')[0].toLowerCase();
			userLang = userLang.replace('-', '_');
		} else {
			userLang = i18n4e.defaultLang;
		}


		if (i18n4e.enableClient){
			if (i18n4e.useLangSession){
				if (!req.session){
					console.error(`You are using useLangSession=true but you do not have a session activated in your express application. Use i18n4eDefaultSession=true or create a session for your express application.`)
					throw new Error('i18n4e session not found -> Use i18n4eDefaultSession=true or create a session for your express application.');
				}else{
					userLang = req.session.lang || userLang;
				}
			}

		}

		if (firstPath.length === 0) firstPath = '/';
		if (i18n4e.langNameInPath && i18n4e.langsFilesPath[lastPath]) {
			userLang = lastPath;
			req.url = firstPath;
		}

		const originalRender = res.render.bind(res);

		res.render = (
			view: string,
			options: any,
			callback?: (err: Error, html: string) => void
		) => {
			let err: Error | null = null;
			if (err) return next(err);

			const cacheKey = `${view}-${userLang}`;
			const cachedHtml = htmlCache.get(cacheKey);
			if (cachedHtml && !dev) {
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
					let instance: string = `i18n invalid value (${key})`;
					if (typeof mainFile[key] === 'string') {
						instance = mainFile[key];
					} else if (typeof mainFile[key] === 'object') {
						instance = mainFile[key].message;
					}

					$('[i18nID="' + key + '"]').text(instance);
				}

				//all extra files
				if (serverSideConfigs.useAllExtraFiles && serverSideConfigs.AllExtraFiles) {
					serverSideConfigs.AllExtraFiles.forEach((file) => {
						const relativePathExtra = path.join(actualDir, file + '.json');
						const extraFile = JSON.parse(fs.readFileSync(relativePathExtra, 'utf8'));
						for (const key in extraFile) {
							let instance: string = `i18n invalid value (${key})`;
							if (typeof extraFile[key] === 'string') {
								instance = extraFile[key];
							} else if (typeof extraFile[key] === 'object') {
								instance = extraFile[key].message;
							}

							$('[i18nID="' + key + '"]').text(instance);
						}
					});
				}

				//extra files
				if (extraFiles && extraFiles.length > 0) {
					extraFiles.forEach((file) => {
						const relativePathExtra = path.join(actualDir, file + '.json');
						const extraFile = JSON.parse(fs.readFileSync(relativePathExtra, 'utf8'));
						for (const key in extraFile) {
							let instance: string = `i18n invalid value (${key})`;
							if (typeof extraFile[key] === 'string') {
								instance = extraFile[key];
							} else if (typeof extraFile[key] === 'object') {
								instance = extraFile[key].message;
							}

							$('[i18nID="' + key + '"]').text(instance);
						}
					});
				}

				const translatedHtml = $.html();
				if (!dev) htmlCache.set(cacheKey, translatedHtml);
				res.send(translatedHtml);
			});
		};
		next();
	});
};
