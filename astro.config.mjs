import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import emdash, { memoryCache } from 'emdash/astro';
import { libsql } from 'emdash/db';
import { maintenancePlugin } from './src/plugins/maintenance';

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
				url: process.env.LIBSQL_DATABASE_URL,
				authToken: process.env.LIBSQL_AUTH_TOKEN,
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
