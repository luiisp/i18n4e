import { Application } from 'express';
import session from 'express-session';
import { randomStr } from './utils/tools';

export const createDefaultSession = (app: Application, dev: boolean = true) => {
	app.use(
		session({
			secret: randomStr(8),
			resave: false,
			saveUninitialized: true,
			cookie: {
				secure: !dev,
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
			},
		})
	);
};
