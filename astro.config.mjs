import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import emdash, { memoryCache, s3 } from 'emdash/astro';
import { libsql } from 'emdash/db';
import { loadEnv } from 'vite';
import { maintenancePlugin } from './src/plugins/maintenance';

const { LIBSQL_AUTH_TOKEN, LIBSQL_DATABASE_URL } = loadEnv(
	process.env.NODE_ENV,
	process.cwd(),
	'',
);

export default defineConfig({
	output: 'server',

	adapter: node({
		mode: 'standalone',
	}),

	image: {
		layout: 'constrained',
		responsiveStyles: true,
	},

	integrations: [
		react(),
		emdash({
			database: libsql({
				url: LIBSQL_DATABASE_URL,
				authToken: LIBSQL_AUTH_TOKEN,
				migrationAuthTokenEnv: 'LIBSQL_AUTH_TOKEN',
			}),
			storage: s3(),
			objectCache: memoryCache(),
			plugins: [maintenancePlugin()],
		}),
	],

	devToolbar: { enabled: false },

	vite: {
		plugins: [tailwindcss()],
	},
});
