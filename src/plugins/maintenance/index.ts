import type { PluginDescriptor } from 'emdash';
import { definePlugin } from 'emdash';

export function maintenancePlugin(): PluginDescriptor {
	return {
		id: 'maintenance',
		version: '0.0.1',

		format: 'native',
		entrypoint: new URL('./index.ts', import.meta.url).href,
	};
}

export function createPlugin() {
	return definePlugin({
		id: 'maintenance',
		version: '0.0.1',
		capabilities: [],
		admin: {
			settingsSchema: {
				active: {
					type: 'boolean',
					label: 'Activer le mode "maintenance"',
					default: false,
				},
			},
		},
	});
}

export default createPlugin;
