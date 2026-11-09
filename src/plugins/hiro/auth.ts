import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2';
import { betterAuth } from 'better-auth/minimal';
import { admin } from 'better-auth/plugins';
import { db } from './db';
import * as schema from './db/schema';

export const auth = betterAuth({
	appName: 'HIRO DEV',

	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema,
		usePlural: true,
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

	user: {
		modelName: 'hiro_customer',
	},
	session: {
		modelName: 'hiro_session',
	},
	verification: {
		modelName: 'hiro_verification',
	},
	account: {
		modelName: 'hiro_account',
	},

	emailAndPassword: {
		enabled: false,
	},

	plugins: [
		admin({
			defaultRole: 'customer',
		}),
	],
});
