import express, { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { I18n4e, InitOptions } from './interfaces';
import cheerio from 'cheerio';
import { serverSideConfigs } from './server-side.config';
import NodeCache from 'node-cache';
import { isRouteBlacklisted } from './utils/utils.main';
import { writeInHtml, readFilesVariables } from './output';
import { cutUrl, alwaysEndWithSlash, isValidLanguageCode } from './utils/tools';
import { SupportedLanguageCode } from './types';
import { throwError } from './errors.handler';

export const i18nServerSideMiddlewareWrapper = (
	app: express.Application,
	i18n4e: I18n4e,
	dev: boolean = true,
	allOptions: InitOptions = {}
) => {
	const htmlCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

	app.use((req: Request, res: Response, next: NextFunction) => {
		if (isRouteBlacklisted(req)) return next();
		let { lastPath, firstPath } = cutUrl(req.url);
		const lastFilesPathObj = i18n4e.langsFilesPath[lastPath];
		const lastPathIsLang = isValidLanguageCode(lastPath) || lastFilesPathObj;
		req.url = alwaysEndWithSlash(req.url);
		let userLang: SupportedLanguageCode = i18n4e.defaultLang;

		try {
			if (req.headers['accept-language']) {
				userLang = req.headers['accept-language']
					.split(',')[0]
					.toLowerCase()
					.replace('-', '_');
			}
		} catch {
			// pass (because userLang is already set [default])
		}

		if (i18n4e.enableClient && i18n4e.useLangSession) {
			if (!req.session) {
				throwError(
					'You are using useLangSession=true but you do not have a session activated in your express application. Use i18n4eDefaultSession=true or create a session for your express application.',
					'session not found -> Use i18n4eDefaultSession=true or create a session for your express application.'
				);
			}

			if (
				!allOptions.disableForceUserLangInPath &&
				allOptions.langNameInPath &&
				req.session.lang &&
				lastPath &&
				lastPath != req.session.lang
			) {
				if (lastFilesPathObj && lastPath != req.session.lang) {
					// ?: appath/en/ -> appath/es/
					return res.redirect(firstPath + req.session.lang);
				}

				return res.redirect(req.url + req.session.lang);
			}

			userLang = req.session.lang || userLang;
		}

		if (i18n4e.langNameInPath) {
			if (lastPathIsLang) {
				userLang = lastPath;
				req.url = firstPath;
			} else {
				// ?: appath/ -> appath/en
				return res.redirect(req.url + userLang);
			}
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
						throwError('Default language not found', 'Default language not found');
					}
				}

				const mainFilePath: string = requestedLangArray[0];
				const actualDir = path.dirname(mainFilePath);

				const mainFile = JSON.parse(fs.readFileSync(mainFilePath, 'utf8'));
				writeInHtml($, mainFile);

				//* extra files
				if (serverSideConfigs.useAllExtraFiles && serverSideConfigs.AllExtraFiles) {
					readFilesVariables($, actualDir, serverSideConfigs.AllExtraFiles);
				}

				//extra files
				if (extraFiles && extraFiles.length > 0) {
					readFilesVariables($, actualDir, extraFiles);
				}

				const translatedHtml = $.html();
				if (!dev) htmlCache.set(cacheKey, translatedHtml);
				res.send(translatedHtml);
			});
		};
		next();
	});
};
