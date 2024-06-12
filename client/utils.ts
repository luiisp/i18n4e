import { syncWithServerTypes } from './config';

export const syncWithServer = async (syncType: 'setLang' | 'unsetLang', data: any) => {
	const syncTypeParams = syncWithServerTypes[syncType];
	if (!syncTypeParams) return console.error('i18n4e Invalid syncType');

	try {
		const response = await fetch(syncTypeParams.path, {
			method: syncTypeParams.method,
			headers: {
				'Content-Type': 'application/json',
				data: JSON.stringify(data),
			},
		});

		if (!response.ok) {
			if (response.status === 404) {
				console.error(
					'i18n4e (404 not found) – You need to enable enableClient=true and useLangSession=true on your server'
				);
			}
			return response;
		}

		const responseData = await response.json();
		document.location.reload();
		return true;
	} catch (error) {
		console.error('i18n4e -> An error occurred while syncing with the server:', error);
		return error;
	}
};
