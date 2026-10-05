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
			}),
			migrations: {
				runtime: 'check',
				dev: 'auto',
			},
			storage: s3(),
			objectCache: memoryCache(),
			plugins: [maintenancePlugin(), emdashSmtp()],
		}),
	],

	devToolbar: { enabled: false },

	vite: {
		plugins: [tailwindcss()],
	},
});
