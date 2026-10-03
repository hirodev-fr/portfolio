import { defineMiddleware } from 'astro:middleware';
import { withEmDashRuntime } from 'emdash/middleware';

const IGNORED_PATHS = ['/_emdash'];
const MAINTENANCE_PAGE = '/maintenance';

const CACHE_TTL_MS = 30_000;

let cache: { active: boolean; expiresAt: number } | null = null;
let inflight: Promise<boolean> | null = null;

async function fetchMaintenanceState(): Promise<boolean> {
	const result = await withEmDashRuntime(async (runtime) => {
		return await runtime.handlePluginApiRoute(
			'maintenance',
			'GET',
			'/active',
			new Request('https://internal/', { method: 'GET' }),
		);
	});
	return (result.data as { active: boolean }).active;
}

async function isMaintenanceActive(): Promise<boolean> {
	if (cache && cache.expiresAt > Date.now()) {
		return cache.active;
	}

	inflight ??= fetchMaintenanceState().finally(() => {
		inflight = null;
	});

	const active = await inflight;
	cache = { active, expiresAt: Date.now() + CACHE_TTL_MS };
	return active;
}

export const maintenanceMiddleware = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;

	if (IGNORED_PATHS.some((path) => pathname.startsWith(path))) {
		return next();
	}

	const onMaintenancePage = pathname.startsWith(MAINTENANCE_PAGE);

	let active: boolean;
	try {
		active = await isMaintenanceActive();
	} catch {
		return next();
	}

	if (!active) {
		return onMaintenancePage ? context.redirect('/') : next();
	}
	return onMaintenancePage ? next() : context.redirect(MAINTENANCE_PAGE);
});
