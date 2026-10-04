import type { PluginDescriptor } from 'emdash';
import { definePlugin } from 'emdash';

export function maintenancePlugin(): PluginDescriptor {
	return {
		id: 'maintenance',
		version: '0.0.1',

		format: 'native',
		entrypoint: './src/plugins/maintenance/index.ts',
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
