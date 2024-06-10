import * as fs from 'fs';
import * as path from 'path';
import { minFilesOptions } from './interfaces';
import { folderNameIsALanguage } from './utils/utils.main';
import { serverSideConfigs } from './server-side.config';
import { scourFolder } from './utils/utils.main';
import { alwaysJson } from './utils/tools';
import { configNameFile } from "./configs"

export const getLanguagesFilesPaths = (
	options: minFilesOptions = {},
	serverSideTranslation: boolean = true
): Promise<{ [key: string]: string[] }> => {
	const regex = /\/|\\/g;
	const definitions = {
		path: options.langsFolder || '',
		mainFile: options.mainFile || 'translation.json',
		extraFiles: options.extraFiles || [],
	};

	definitions.mainFile = alwaysJson(definitions.mainFile);
	definitions.path = definitions.path.replace(regex, path.sep);

	let langsFolder = path.join(definitions.path);
	return new Promise((resolve, reject) => {
		fs.readdir(langsFolder, (err, files) => {
			if (err) {
				const localesFolderName =
					path.basename(path.resolve(definitions.path)) || '_locales';
				const tryScour = scourFolder(localesFolderName);

				if (!tryScour) {
					return reject(
						new Error(
							`i18n4e languages folder defined as (${definitions.path}) was not found or is not a valid path. Err: ${err.message}`
						)
					);
				}
				definitions.path = tryScour;
				langsFolder = path.join(definitions.path);
				files = fs.readdirSync(langsFolder);
				if (!files) {
					return reject(
						new Error(
							`i18n4e languages folder defined as (${definitions.path}) was not found or is not a valid path. Err: ${err.message}, Scour is false -> ${tryScour}`
						)
					);
				}
			}

			const returnFilesPathValues: { [key: string]: string[] } = {};

			if (serverSideTranslation) {
				const serverSideMainFilePath = path.join(langsFolder, configNameFile); // .json
				fs.access(serverSideMainFilePath, fs.constants.F_OK, (err) => {
					if (!err) {
						const serverSideMainFileJSON = fs.readFileSync(
							serverSideMainFilePath,
							'utf8'
						);
						const serverSideMainFileParsed = JSON.parse(serverSideMainFileJSON);

						if (serverSideMainFileParsed.removeTagAfterTranslation) {
							serverSideConfigs.removeTagAfterTranslation = true;
						}

						if (serverSideMainFileParsed.extraFiles) {
							const allExtraFiles = serverSideMainFileParsed.extraFiles.find(
								(file: any) => file.view === '*'
							);

							if (allExtraFiles && allExtraFiles.files.length > 0) {
								serverSideConfigs.useAllExtraFiles = true;
								serverSideConfigs.AllExtraFiles = allExtraFiles.files;
							}

							serverSideConfigs.extraFiles = serverSideMainFileParsed.extraFiles;
						}
					} else {
						serverSideConfigs.optionsServerSide = false;
					}
				});
			}

			const promises = files.map((file) => {
				return new Promise((resolve, reject) => {
					if (!folderNameIsALanguage(file) && file.endsWith('.json') == false) {
						return reject(
							new Error(
								`The folder (${file}) is not a valid language folder. Consult the i18n4e supported languages list.`
							)
						);
					}
					const filePath = path.join(langsFolder, file);

					fs.stat(filePath, (err, stats) => {
						if (err) {
							return reject(new Error(`Unable to read i18n4e folder in ${filePath}`));
						}

						if (stats.isDirectory()) {
							const mainTranslationFilePath = path.join(
								filePath,
								definitions.mainFile
							);

							fs.access(mainTranslationFilePath, fs.constants.F_OK, (err) => {
								if (err) {
									return reject(
										new Error(
											`The main json file defined as (${definitions.mainFile}) was not found. Expected Path: ${mainTranslationFilePath}`
										)
									);
								} else {
									returnFilesPathValues[file] = [mainTranslationFilePath];

									if (definitions.extraFiles.length) {
										const extraPromises = definitions.extraFiles.map(
											(extraFile) => {
												return new Promise((resolve, reject) => {
													const extraFilePath = path.join(
														filePath,
														extraFile
													);

													fs.access(
														extraFilePath,
														fs.constants.F_OK,
														(err) => {
															if (err) {
																return reject(
																	new Error(
																		`The file (${extraFile}) was defined as extra but was not found. Expected Path: ${extraFilePath}`
																	)
																);
															} else {
																returnFilesPathValues[file].push(
																	extraFilePath
																);
																resolve(returnFilesPathValues);
															}
														}
													);
												});
											}
										);

										Promise.all(extraPromises)
											.then(() => resolve(returnFilesPathValues))
											.catch(reject);
									} else {
										resolve(returnFilesPathValues);
									}
								}
							});
						} else {
							resolve(returnFilesPathValues);
						}
					});
				});
			});

			Promise.all(promises)
				.then(() => resolve(returnFilesPathValues))
				.catch((err) => reject(err));
		});
	});
};

export const returnVarTranslationsFromFiles = (langFilesPaths: string[]) => {
	let varTranslationsFromFiles: { [key: string]: any } = {}; // for client-side translations
	langFilesPaths.forEach((file) => {
		const fileJSON = fs.readFileSync(file, 'utf8');
		const fileParsed = JSON.parse(fileJSON);
		Object.entries(fileParsed).forEach(([key, value]: [string, any]) => {
			let instance: string = `i18n Invalid Value (${key})`;
			if (typeof value === 'string') {
				instance = value;
			} else if (typeof value === 'object') {
				instance = value.message;
			}

			varTranslationsFromFiles[key] = instance;
		});
	});

	return varTranslationsFromFiles;
};
