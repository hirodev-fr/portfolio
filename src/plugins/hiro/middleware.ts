import { defineMiddleware } from 'astro:middleware';
import { auth } from '@/plugins/hiro/auth';

export const authMiddleware = defineMiddleware(async (context, next) => {
	const isAuthed = await auth.api.getSession({
		headers: context.request.headers,
	});

	if (isAuthed) {
		context.locals.customerUser = isAuthed.user;
		context.locals.customerSession = isAuthed.session;
	} else {
		context.locals.customerUser = null;
		context.locals.customerSession = null;
	}

	return next();
});
