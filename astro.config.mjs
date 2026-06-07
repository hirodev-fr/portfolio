import { defineConfig, fontProviders, envField } from 'astro/config';

import emdash from 'emdash/astro';

import node from '@astrojs/node';
import { sqlite } from 'emdash/db';
import { local } from 'emdash/astro';

import cloudflare from '@astrojs/cloudflare';
import { d1, r2 } from '@emdash-cms/cloudflare';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// needs dynamic workers
// import hiro from './src/plugins/hiro/index.ts';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
	output: 'server',
	adapter: isProd ? cloudflare() : node({ mode: 'standalone' }),

	image: {
		layout: 'constrained',
		responsiveStyles: true,
	},

	integrations: [
		react(),
		emdash({
			database: isProd ? d1({ binding: 'DB' }) : sqlite({ url: 'file:./data/data.db' }),
			storage: isProd
				? r2({ binding: 'MEDIA' })
				: local({
						directory: './data/uploads',
						baseUrl: '/_emdash/api/media/file',
					}),

			// needs dynamic workers
			// plugins: [hiro()],
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
