import { defineConfig, fontProviders, envField } from 'astro/config';

import emdash from 'emdash/astro';

import { loadAdapter } from './astro.build';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// needs dynamic workers
// import hiro from './src/plugins/hiro/index.ts';

const adapterType = process.env.ENV_ADAPTER;
const adapter = loadAdapter(adapterType);

export default defineConfig({
	output: 'server',
	adapter: adapter.mode,

	image: {
		layout: 'constrained',
		responsiveStyles: true,
	},

	integrations: [
		react(),
		emdash({
			database: adapter.database,
			storage: adapter.storage,

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
