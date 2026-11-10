import { defineMiddleware } from 'astro:middleware';
import { isPageAllowedInMaintenance } from './policy';
import { isMaintenanceActive } from './status';

const EXEMPT_PATHS = [
	'/_emdash',
	'/_astro',
	'/robots.txt',
	'/sitemap',
	'/health',
	'/ready',
	'/favicon.ico',
];

export const maintenanceMiddleware = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;
	if (
		EXEMPT_PATHS.some(
			(path) =>
				pathname === path ||
				pathname.startsWith(`${path}/`) ||
				(path === '/sitemap' && pathname.startsWith('/sitemap-')),
		)
	)
		return next();
	try {
		if (!(await isMaintenanceActive())) {
			return pathname === '/maintenance' ? context.redirect('/') : next();
		}
		if (
			pathname.startsWith('/policies/') &&
			(await isPageAllowedInMaintenance(pathname))
		)
			return next();
	} catch (error) {
		console.error('Maintenance lookup failed', error);
	}
	const response = await (pathname === '/maintenance'
		? next()
		: context.rewrite('/maintenance'));
	const headers = new Headers(response.headers);
	headers.set('Retry-After', '300');
	headers.set('Cache-Control', 'no-store');
	return new Response(response.body, { status: 503, headers });
});
