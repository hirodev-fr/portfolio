import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import emdash, { local, memoryCache } from 'emdash/astro';
import { sqlite } from 'emdash/db';
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
			database: sqlite({ url: 'file:./data/data.db' }),
			storage: local({
				directory: './data/uploads',
				baseUrl: '/_emdash/api/media/file',
			}),
			objectCache: memoryCache(),
			plugins: [maintenancePlugin()],
		}),
	],

	devToolbar: { enabled: false },

	vite: {
		plugins: [tailwindcss()],
	},
});
