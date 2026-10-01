import type { PluginDescriptor } from 'emdash';
import { definePlugin } from 'emdash';

export function maintenancePlugin(): PluginDescriptor {
	return {
		id: 'plugin-maintenance',
		version: '0.0.1',
		format: 'native',
		entrypoint: '@portfolio/maintenance',
	};
}

export function createPlugin() {
	return definePlugin({
		id: 'plugin-maintenance',
		version: '0.0.1',
		capabilities: [],
	});
}

export default createPlugin;
