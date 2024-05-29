import express, { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { I18n4e } from './interfaces';
import cheerio from 'cheerio';
import { serverSideConfigs } from './server-side.config';

export const i18nServerSideMiddlewareWrapper = (app: express.Application, i18n4e: I18n4e) => {
	app.use((req: Request, res: Response, next: NextFunction) => {
		const originalRender = res.render.bind(res);
		let userLang: string;

		if (req.headers['accept-language']) {
			userLang = req.headers['accept-language'].split(',')[0].toLowerCase();
			userLang = userLang.replace('-', '_');
		}else{
			userLang = i18n4e.defaultLang;
		}

		console.log("\n Language detected -->", userLang)


		res.render = (
			view: string,
			options: any,
			callback?: (err: Error, html: string) => void
		) => {
			console.log('\nRendering the view view -->', view);
			let err: Error | null = null; 
			if (err) return next(err);

			let extraFiles: string[] = [];
			if (serverSideConfigs.extraFiles && serverSideConfigs.extraFiles.length > 0) {
				console.log('Extra files finded..',view);
				const viewName = serverSideConfigs.extraFiles.find((file) => file.name === view);
				if (viewName) {
					console.log('Extra files found for this view..');
					extraFiles = viewName.files;
					console.log('\n Extra files found -->', viewName);
				}else{
					console.log('Extra files not found for this view..');
				}
			}


			originalRender(view, options, (err, html) => {
				console.log('Original render called');
				if (err) return next(err);
				const $ = cheerio.load(html);


				$('html').attr('lang', userLang);
				let requestedLangArray = i18n4e.langsFilesPath[userLang];

				if (!requestedLangArray || requestedLangArray.length == 0) {
					console.log('\n Language Files not found .. Trying to use default language');
					userLang = i18n4e.defaultLang;
					requestedLangArray = i18n4e.langsFilesPath[userLang];
					if (!requestedLangArray){
						throw new Error('Default language not found');
					}
				};
				const mainFilePath = requestedLangArray[0];
				console.log("Requested Lang Array", requestedLangArray, "for lang", userLang)
				console.log("Main file path: ", mainFilePath)
				console.log("i18n4e paths", i18n4e.langsFilesPath)
				const actualDir = path.dirname(mainFilePath);
				console.log("Actual dir: ", actualDir)
			//	delete requestedLangArray[0];

				console.log('\n Main file path: ', mainFilePath);
				console.log('\n Actual dir: ', actualDir);


				const mainFile = JSON.parse(fs.readFileSync(mainFilePath, 'utf8'));
				console.log('Main file opened.. ');
				for (const key in mainFile) {
					$('[i18nID="' + key + '"]').text(mainFile[key].message);
				}

				//all extra files
				if (serverSideConfigs.useAllExtraFiles && serverSideConfigs.AllExtraFiles) {
					console.log("have all extra files.. trying to use them..")
					serverSideConfigs.AllExtraFiles.forEach((file) => {
						const relativePathExtra = path.join(actualDir, file + ".json");

						console.log('\n New Extra file PATH --> ', relativePathExtra);
						const extraFile = JSON.parse(fs.readFileSync(relativePathExtra, 'utf8'));
						for (const key in extraFile) {
							$('[i18nID="' + key + '"]').text(extraFile[key].message);
						}
					});
				}

				//extra files
				if ( extraFiles && extraFiles.length > 0 ) {
					
					console.log("have extra files only for this view.. trying to use them..")
					extraFiles.forEach((file) => {
						const relativePathExtra = path.join(actualDir, file + ".json");
						const extraFile = JSON.parse(fs.readFileSync(relativePathExtra, 'utf8'));
						console.log('Extra file: ', extraFile);
						for (const key in extraFile) {
							$('[i18nID="' + key + '"]').text(extraFile[key].message);
						}
					});
				}



				console.log('Sending modified HTML');
				res.send($.html());
			});
		};
		next();
	});
};