import { defineMiddleware, sequence } from 'astro:middleware';
import { authMiddleware } from './plugins/hiro/middleware';
import { maintenanceMiddleware } from './plugins/maintenance/middleware';

export const onRequest = defineMiddleware(
	sequence(authMiddleware, maintenanceMiddleware),
);
