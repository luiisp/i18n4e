import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';



export const writeInHtml = ($: any, file: any) => {

	for (const key in file) {
		let instance: string = `i18n invalid value (${key})`;
		switch (typeof file[key]) {
			case 'string':
				instance = file[key];
				break;
			case 'object':
				instance = file[key].message;
				break;
		}

		$('[i18nID="' + key + '"]').text(instance);
	}

};

export const readFilesVariables = ($: any,directory: any,files: any): boolean =>{
	files.forEach((file:string) => {
		const relativePathExtra = path.join(directory, file + '.json');
		const extraFile = JSON.parse(fs.readFileSync(relativePathExtra, 'utf8'));
		writeInHtml($, extraFile);
	});
	return true;
};