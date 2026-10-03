import { defineMiddleware } from 'astro:middleware';
import { withEmDashRuntime } from 'emdash/middleware';

export const maintenanceMiddleware = defineMiddleware(async (context, next) => {
	const WHITELIST = ['/_emdash'];

	const { url } = context.request;

	if (WHITELIST.some((path) => url.includes(path))) return next();

	const result = await withEmDashRuntime(async (runtime) => {
		return await runtime.handlePluginApiRoute(
			'maintenance',
			'GET',
			'/active',
			new Request('https://internal/', {
				method: 'GET',
			}),
		);
	});

	const { active } = result.data as { active: boolean };

	console.log('ran maintenance middleware');

	if (!active) return next();

	console.log('maintenance mode active');

	return next('/maintenance');
});
