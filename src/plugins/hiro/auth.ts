import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2';
import { betterAuth } from 'better-auth/minimal';
import { db } from './db';
import * as schema from './db/schema';

export const auth = betterAuth({
	appName: 'HIRO DEV',

	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema,
	}),

	advanced: {
		cookies: {
			session_token: {
				name: 'c_session_token',
			},
			session_data: {
				name: 'c_session_data',
			},
			dont_remember: {
				name: 'c_dont_remember',
			},
		},
	},

	emailAndPassword: {
		enabled: false,
	},
});
