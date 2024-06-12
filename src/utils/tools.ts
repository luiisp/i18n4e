export const alwaysJson = (file: string): string => {
	if (file.endsWith('.json')) {
		return file;
	}

	return file + '.json';
};

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
}