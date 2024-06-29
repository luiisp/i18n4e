import 'express';
import 'express-session';

declare module 'express' {
	interface Request {
		i18n_lang?: string;
	}
}

declare module 'express-session' {
	interface Session {
		lang?: string;
	}
}
