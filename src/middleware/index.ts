import { defineMiddleware } from 'astro:middleware';
import { env } from '../../env';

export const onRequest = defineMiddleware((context, next) => {
	const url = new URL(context.request.url);

	if (!env.IN_BUILD) {
		return next();
	}

	if (
		url.pathname === '/in-build' ||
		url.pathname === '/robots.txt' ||
		url.pathname === '/sitemap-index.xml' ||
		url.pathname === '/favicon.ico' ||
		url.pathname.includes('_emdash/admin') ||
		url.pathname.includes('_emdash/api')
	) {
		return next();
	}

	const isPolicyRequest = url.pathname.includes('policies');

	if (isPolicyRequest && env.ALLOW_POLICIES_IN_BUILD) {
		return next();
	}

	return context.redirect('/in-build', 307);
});
