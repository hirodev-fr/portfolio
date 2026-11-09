import { drizzle } from 'drizzle-orm/libsql/web';
import { authRelations } from './schema.ts';

export const db = drizzle({
	connection: {
		url: process.env.LIBSQL_DATABASE_URL,
	},
	relations: { ...authRelations },
});
