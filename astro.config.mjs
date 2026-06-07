import { defineConfig, fontProviders, envField } from 'astro/config';

import node from '@astrojs/node';
import { sqlite } from 'emdash/db';
import emdash, { local } from 'emdash/astro';

// TODO : use cloudflare in prod
// import cloudflare from '@astrojs/cloudflare';
// import { d1, r2 } from '@emdash-cms/cloudflare';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import hiro from './src/plugins/hiro/index.ts';

export default defineConfig({
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	// TODO : use cloudflare in prod
	// adapter: cloudflare(),

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
			plugins: [hiro()],
			// TODO : use cloudflare in prod
			// database: d1({ binding: "DB" }),
			// storage: r2({ binding: "MEDIA" }),
		}),
	],

	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Space Grotesk',
			cssVariable: '--font-display',
			weights: [400, 500, 700],
			fallbacks: ['sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-mono',
			weights: [400],
			fallbacks: ['monospace'],
		},
	],

	devToolbar: { enabled: false },

	vite: {
		plugins: [tailwindcss()],

		// TODO : remove before prod
		// fix 500 : require is not defined
		optimizeDeps: {
			include: ['@emdash-cms/registry-client > semver'],
		},
	},

	env: {
		schema: {
			IN_BUILD: envField.boolean({ context: 'client', access: 'public', default: false }),
			ALLOW_POLICIES_IN_BUILD: envField.boolean({
				context: 'client',
				access: 'public',
				default: false,
			}),
		},
	},
});
