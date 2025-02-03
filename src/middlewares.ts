import express, { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { I18n4e, InitOptions } from './interfaces';
import cheerio from 'cheerio';
import { serverSideConfigs } from './server-side.config';
import NodeCache from 'node-cache';
import { isRouteBlacklisted } from './utils/utils.main';
import { writeInHtml, readFilesVariables } from './output';
import { cutUrl, alwaysEndWithSlash, isValidLanguageCode, useReqLang } from './utils/tools';
import { SupportedLanguageCode } from './types';
import { throwError } from './errors.handler';
import { getRequestedLangArray } from './utils/utils.main';

export const i18nServerSideMiddlewareWrapper = (
	app: express.Application,
	i18n4e: I18n4e,	
	dev: boolean = true,
	allOptions: InitOptions = {}
) => {
	const htmlCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 }); // set cache

	app.use((req: Request, res: Response, next: NextFunction) => { 
		
		let { lastPath, firstPath } = cutUrl(req.url);
		const lastFilesPathObj = i18n4e.langsFilesPath[lastPath];
		const lastPathIsLang = isValidLanguageCode(lastPath) || lastFilesPathObj;
		req.url = alwaysEndWithSlash(req.url);
		const rLang: any = useReqLang(req.headers['accept-language'])
		let userLang: SupportedLanguageCode = rLang || i18n4e.defaultLang;



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

		if (isRouteBlacklisted(req)){
			/* © i18n4e Pedro Luis Dias - https://github.com/diaslui/i18n4e
			* send userLang to the next middleware
			* solved: https://github.com/diaslui/i18n4e/issues/16
			*/ 
			req.i18n_lang = userLang;
			return next();
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

				const requestedLangArray = getRequestedLangArray(userLang);

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
