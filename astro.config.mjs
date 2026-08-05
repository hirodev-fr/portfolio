import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import emdash, { s3 } from 'emdash/astro';
import { postgres } from 'emdash/db';

import { loadEnv } from 'vite';

const {
	DB_HOST,
	DB_PORT,
	DB_USER,
	DB_PASSWORD,
	DB_NAME,
	S3_PUBLIC_URL,
	S3_ENDPOINT,
	S3_BUCKET,
	S3_ACCESS_KEY_ID,
	S3_SECRET_ACCESS_KEY,
} = loadEnv(process.env.NODE_ENV, process.cwd(), '');

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
				host: DB_HOST,
				port: DB_PORT,
				user: DB_USER,
				password: DB_PASSWORD,
				database: DB_NAME,
			}),
			storage: s3({
				endpoint: S3_ENDPOINT,
				bucket: S3_BUCKET,
				accessKeyId: S3_ACCESS_KEY_ID,
				secretAccessKey: S3_SECRET_ACCESS_KEY,
				publicUrl: S3_PUBLIC_URL,
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
