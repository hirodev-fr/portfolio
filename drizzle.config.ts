import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './src/plugins/hiro/db/migrations',
	schema: './src/plugins/hiro/db/schema.ts',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.LIBSQL_DATABASE_URL!,
	},
	migrations: {
		table: '__hiro_migrations__',
	},
});
