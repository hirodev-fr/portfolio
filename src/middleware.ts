import { defineMiddleware, sequence } from 'astro:middleware';
import { maintenanceMiddleware } from './plugins/maintenance/middleware';
import { securityHeaders } from './security-headers';

export const onRequest = defineMiddleware(
	sequence(securityHeaders, maintenanceMiddleware),
);
