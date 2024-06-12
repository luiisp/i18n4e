import 'express-session';

declare module 'express-session' {
	interface Session {
		lang?: string;
	}
}
