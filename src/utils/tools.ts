export const alwaysJson = (file: string): string => {

	if (file.endsWith('.json')) {
		return file;
	}

	return file + '.json';
};