import { defineMiddleware } from 'astro:middleware';
import { IN_BUILD, ALLOW_POLICIES_IN_BUILD } from 'astro:env/client';

export const onRequest = defineMiddleware((context, next) => {
	const url = new URL(context.request.url);

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

	if (!IN_BUILD) {
		return next();
	}

	if (isPolicyRequest && ALLOW_POLICIES_IN_BUILD) {
		return next();
	}

	return context.redirect('/in-build', 307);
});
