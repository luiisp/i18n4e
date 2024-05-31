import * as process from 'process';
import express from 'express';
import * as path from 'path';
import { wrapperAddTranslationsRoute } from './routes';
import { getLanguagesFilesPaths } from './files.handler';
import { I18n4e, InitOptions } from './interfaces';
import { i18nServerSideMiddlewareWrapper } from './middleware';
import { CallSite } from './types';

function getCallerFile(position: number = 2): string | undefined {
	if (position >= Error.stackTraceLimit) {
		throw new TypeError(
			'getCallerFile(position) requires position be less than Error.stackTraceLimit but position was: `' +
				position +
				'` and Error.stackTraceLimit was: `' +
				Error.stackTraceLimit +
				'`'
		);
	}

	const oldPrepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = (err, stack) => stack;
	const err = new Error();
	const stack = err.stack as unknown as CallSite[];
	Error.prepareStackTrace = oldPrepareStackTrace;

	if (stack !== null && typeof stack === 'object') {
		const callSite = stack[position];
		return callSite ? callSite.getFileName() || undefined : undefined;
	}
	return undefined;
}

const i18n4e: I18n4e = {
	langsFilesPath: {},
	defaultLang: 'en',
	locatesFolder: '',
	path: '/i18n4e/i/translations',
	init: (
		app: express.Application,
		{ options = {}, serverSideTranslation = false }: InitOptions = {}
	): Promise<any> => {
		if (serverSideTranslation) i18nServerSideMiddlewareWrapper(app, i18n4e);

		if (options.defaultLang) i18n4e.defaultLang = options.defaultLang;

		if (options.path) i18n4e.path = options.path;

		let caller = getCallerFile(2);

		console.log('caller', caller);
		if (!caller || typeof caller != 'string')
			throw new Error('i18n4e (Init Error): Unable to get caller path.');
		if (caller.includes('file')) caller = caller.split('///')[1];
		const finalPath = path.dirname(caller);
		options.langsFolder = options.langsFolder
			? path.resolve(finalPath || './', options.langsFolder)
			: finalPath + '/_locales';
		i18n4e.locatesFolder = options.langsFolder;

		return getLanguagesFilesPaths(options, serverSideTranslation)
			.then((filesPaths: any) => {
				i18n4e.langsFilesPath = filesPaths;
				if (!serverSideTranslation) wrapperAddTranslationsRoute(app, { i18n4e: i18n4e });

				return filesPaths;
			})
			.catch((err: Error) => {
				console.error(
					`\x1b[3m\x1b[34m[i18n4e\x1b[0m \x1b[31m\x1b[1mError\x1b[0m \x1b[3m\x1b[34m(On Init)]\x1b[0m  \x1b[33m-->\x1b[0m \x1b[31m\x1b[1m${err.message}\x1b[0m`
				);
				throw new Error('i18n4e (Init Error)');
			});
	},
};

export { i18n4e };
