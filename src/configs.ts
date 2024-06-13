import { Route } from "./types"

export const i18n4eMainRouteName: string = '/i18n4e/client/d/main';
export const configNameFile: string = 'i18n4e.config.json';
export const routesNames: { [key: string]: Route } = {
	getLangs: {
	  path: i18n4eMainRouteName + '/get-langs',
	  method: 'GET',
	},
	setLang: {
	  path: i18n4eMainRouteName + '/set-lang',
	  method: 'POST',
	},
	unsetLang: {
	  path: i18n4eMainRouteName + '/unset-lang',
	  method: 'GET',
	},
  };