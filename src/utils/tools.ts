import { SupportedLanguageCode } from '../types';
import { supportedLanguages } from '../configs';

export const isValidLanguageCode = (code: string): code is SupportedLanguageCode => {
	return supportedLanguages.includes(code as SupportedLanguageCode);
};

export const alwaysJson = (file: string): string => {
	if (file.endsWith('.json')) {
		return file;
	}

	return file + '.json';
};

export const cutUrl = (url: string): { firstPath: string; lastPath: string } => {
	const splitedUrl = url.split('/');
	let lastPath = splitedUrl[splitedUrl.length - 1].replace('-', '_').toLowerCase();
	let firstPath = url.split('/' + lastPath)[0];
	if (firstPath.length === 0) firstPath = '/';
	lastPath = neverEndWithSlash(lastPath);
	firstPath = alwaysEndWithSlash(firstPath);
	return { firstPath, lastPath };
};

export const neverEndWithSlash = (url: string): string => {
	if (url.endsWith('/')) {
		return url.slice(0, -1);
	}

	return url;
}

export const alwaysEndWithSlash = (url: string): string => {
	if (url.endsWith('/')) {
		return url;
	}

	return url + '/';
};

export const useReqLang = (acceptLanguage: any): SupportedLanguageCode | undefined => {
	let lang: SupportedLanguageCode | undefined = undefined;
	try {
		if (acceptLanguage) {
			lang = acceptLanguage
				.split(',')[0]
				.toLowerCase()
				.replace('-', '_');
		}
		return lang;
	} catch {
		return undefined;
	}
}

export const randomStr = (length: number): string => {
	let result: string = '';
	const characters: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength: number = characters.length;
	let counter: number = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
};
