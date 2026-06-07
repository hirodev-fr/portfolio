import { definePlugin, type PluginDescriptor } from 'emdash';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import type { HiroPluginOptions } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function hiro(options: HiroPluginOptions = {}): PluginDescriptor {
	return {
		id: 'hiro',
		version: '1.0.0',
		format: 'native',
		entrypoint: resolve(__dirname, 'index.ts'),
		adminEntry: resolve(__dirname, 'admin.tsx'),
		adminPages: [{ path: '/settings', label: 'Paramètres', icon: 'settings' }],
		options: options,
	};
}

export function createPlugin(_options: HiroPluginOptions = {}) {
	return definePlugin({
		id: 'hiro',
		version: '1.0.0',

		admin: {
			entry: resolve(__dirname, 'admin.tsx'),
			settingsSchema: {
				contactEmail: {
					type: 'email',
					label: 'Email de contact',
					default: 'contact@hirodev.fr',
				},
				RGPDEmail: {
					type: 'email',
					label: 'Email RGPD',
					default: 'rgpd@hirodev.fr',
				},
			},

			pages: [
				{
					label: 'Paramètres',
					icon: 'settings',
					path: '/settings',
				},
			],
		},

		routes: {
			settings: {
				handler: async (ctx) => {
					const settings = await ctx.kv.list('settings:');
					const result: Record<string, unknown> = {};
					for (const entry of settings) {
						result[entry.key.replace('settings:', '')] = entry.value;
					}

					return result;
				},
			},
			'settings/save': {
				handler: async (ctx) => {
					const input = ctx.input as Record<string, unknown>;
					for (const [key, value] of Object.entries(input)) {
						if (value !== undefined) {
							await ctx.kv.set(`settings:${key}`, value);
						}
					}
					return { success: true };
				},
			},
		},
	});
}
