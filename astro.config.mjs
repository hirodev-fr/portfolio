import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import emdash, { memoryCache, s3 } from 'emdash/astro';
import { libsql } from 'emdash/db';
import { emdashSmtp } from 'emdash-smtp';
import { loadEnv } from 'vite';
import { maintenancePlugin } from './src/plugins/maintenance';

const { LIBSQL_DATABASE_URL } = loadEnv(
	process.env.NODE_ENV,
	process.cwd(),
	'',
);

export default defineConfig({
	output: 'server',
	site: 'https://hirodev.fr',
	security: { allowedDomains: [{ protocol: 'https', hostname: 'hirodev.fr' }] },
	build: { inlineStylesheets: 'never' },

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
			siteUrl: 'https://hirodev.fr',
			admin: { locales: ['en', 'fr'] },
			database: libsql({
				url: LIBSQL_DATABASE_URL,
			}),
			migrations: {
				runtime: 'check',
				dev: 'auto',
			},
			storage: s3(),
			objectCache: memoryCache(),
			sandboxRunner: '@emdash-cms/sandbox-workerd/sandbox',
			plugins: [maintenancePlugin(), emdashSmtp()],
		}),
	],

	devToolbar: { enabled: false },

	vite: {
		plugins: [tailwindcss()],
	},
});
