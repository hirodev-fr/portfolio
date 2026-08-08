import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import emdash, { s3 } from 'emdash/astro';
import { postgres } from 'emdash/db';

export default defineConfig({
	output: 'server',
	adapter: node({ mode: 'standalone' }),

	image: {
		layout: 'constrained',
		responsiveStyles: true,
	},

	integrations: [
		react(),
		emdash({
			database: postgres({
				connectionString: process.env.POSTGRES_URL,
			}),
			storage: s3({
				endpoint: process.env.S3_ENDPOINT,
				bucket: process.env.S3_BUCKET,
				accessKeyId: process.env.S3_ACCESS_KEY_ID,
				secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
				publicUrl: process.env.S3_PUBLIC_URL,
			}),
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
});
