import { defineMiddleware } from 'astro:middleware';
import { isMaintenanceActive } from './state';

const IGNORED_PATHS = ['/_emdash'];
const MAINTENANCE_PAGE = '/maintenance';

export const maintenanceMiddleware = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;

	if (IGNORED_PATHS.some((path) => pathname.startsWith(path))) {
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
	return onMaintenancePage ? next() : context.redirect(MAINTENANCE_PAGE);
});
