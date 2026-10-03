import type { PluginDescriptor } from 'emdash';
import { definePlugin } from 'emdash';

export function maintenancePlugin(): PluginDescriptor {
	return {
		id: 'maintenance',
		version: '0.0.1',
		format: 'native',
		entrypoint: './src/plugins/maintenance.ts',
	};
}

export function createPlugin() {
	return definePlugin({
		id: 'maintenance',
		version: '0.0.1',
		capabilities: [],
		admin: {
			settingsSchema: {
				enableMaintenanceMode: {
					type: 'boolean',
					label: 'Activer le mode "maintenance"',
					default: false,
				},
			},
		},
		routes: {
			status: {
				permission: 'plugins:read',
				public: true,
				handler: async (ctx) => ({
					enabled:
						(await ctx.settings.get<boolean>('enableMaintenanceMode')) ?? false,
				}),
			},
		},
	});
}

export default createPlugin;
