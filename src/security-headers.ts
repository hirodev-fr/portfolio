import { defineMiddleware } from 'astro:middleware';

export const securityHeaders = defineMiddleware(async (context, next) => {
	const response = await next();
	const headers = new Headers(response.headers);
	headers.set('X-Content-Type-Options', 'nosniff');
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	if (
		context.url.pathname !== '/_emdash' &&
		!context.url.pathname.startsWith('/_emdash/')
	) {
		const media = process.env.S3_PUBLIC_URL
			? new URL(process.env.S3_PUBLIC_URL).origin
			: '';
		const sources = ["'self'", 'https://analytics.hirodev.fr', media]
			.filter(Boolean)
			.join(' ');
		headers.set(
			'Content-Security-Policy',
			[
				"default-src 'self'",
				`script-src 'self' https://analytics.hirodev.fr`,
				"style-src 'self'",
				`img-src ${sources} data:`,
				`connect-src ${sources}`,
				`media-src ${sources}`,
				"font-src 'self'",
				"frame-ancestors 'none'",
				"base-uri 'self'",
				"object-src 'none'",
				"form-action 'self'",
			].join('; '),
		);
	}
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});
