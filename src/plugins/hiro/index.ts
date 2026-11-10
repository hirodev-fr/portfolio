import type { PluginDescriptor } from 'emdash';
import { definePlugin } from 'emdash';

export function hiroPlugin(): PluginDescriptor {
	return {
		id: 'hiro',
		version: '0.0.1',
		format: 'native',
		entrypoint: new URL('./index.ts', import.meta.url).href,
	};
}

export function createPlugin() {
	return definePlugin({
		id: 'hiro',
		version: '0.0.1',
		capabilities: [],
		admin: {},
	});
}

export default createPlugin;
