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
				enableMaintenanceMode: {
					type: 'boolean',
					label: 'Activer le mode "maintenance"',
					default: false,
				},
			},
		},
		routes: {
			active: {
				methods: ['GET'],
				handler: async (ctx) => {
					const active =
						(await ctx.kv.get<boolean>('settings:enableMaintenanceMode')) ??
						false;
					return { active };
				},
			},
		},
	});
}

export default createPlugin;
