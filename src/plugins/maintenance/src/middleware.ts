import { defineMiddleware } from 'astro:middleware';
import { isPageAllowedInMaintenance } from './policy';
import { isMaintenanceActive } from './status';

const IGNORED_PATHS = ['/_emdash', '/robots.txt', '/sitemap'];
const MAINTENANCE_PAGE = '/maintenance';

export const maintenanceMiddleware = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;

	if (
		IGNORED_PATHS.some((path) => pathname === path || pathname.startsWith(path))
	) {
		return next();
	}

	const onMaintenancePage =
		pathname === MAINTENANCE_PAGE ||
		pathname.startsWith(`${MAINTENANCE_PAGE}/`);

	let active: boolean;
	try {
		active = await isMaintenanceActive();
	} catch {
		return next();
	}

	if (!active) {
		return onMaintenancePage ? context.redirect('/') : next();
	}

	if (onMaintenancePage) return next();

	const allowed = await isPageAllowedInMaintenance(pathname);

	if (!allowed) {
		return context.redirect(MAINTENANCE_PAGE);
	}

	return next();
});
