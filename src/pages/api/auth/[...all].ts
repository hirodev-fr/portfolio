import type { APIRoute } from 'astro';
import { auth } from '@/plugins/hiro/auth';

export const ALL: APIRoute = async (ctx) => {
	ctx.request.headers.set('x-forwarded-for', ctx.clientAddress);
	return auth.handler(ctx.request);
};
