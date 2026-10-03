import { defineMiddleware, sequence } from 'astro:middleware';
import { maintenanceMiddleware } from './plugins/maintenance/middleware';

export const onRequest = defineMiddleware(sequence(maintenanceMiddleware));
