import { defineRelationsPart, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const hiro_customers = sqliteTable('hiro_customers', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' })
		.default(false)
		.notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: text('role'),
	banned: integer('banned', { mode: 'boolean' }).default(false),
	banReason: text('ban_reason'),
	banExpires: integer('ban_expires', { mode: 'timestamp_ms' }),
});

export const hiro_sessions = sqliteTable(
	'hiro_sessions',
	{
		id: text('id').primaryKey(),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
		token: text('token').notNull().unique(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => hiro_customers.id, { onDelete: 'cascade' }),
		impersonatedBy: text('impersonated_by'),
	},
	(table) => [index('hiro_sessions_userId_idx').on(table.userId)],
);

export const hiro_accounts = sqliteTable(
	'hiro_accounts',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => hiro_customers.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: integer('access_token_expires_at', {
			mode: 'timestamp_ms',
		}),
		refreshTokenExpiresAt: integer('refresh_token_expires_at', {
			mode: 'timestamp_ms',
		}),
		scope: text('scope'),
		password: text('password'),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index('hiro_accounts_userId_idx').on(table.userId)],
);

export const hiro_verifications = sqliteTable(
	'hiro_verifications',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index('hiro_verifications_identifier_idx').on(table.identifier)],
);

export const hiro_apikeys = sqliteTable(
	'hiro_apikeys',
	{
		id: text('id').primaryKey(),
		configId: text('config_id').default('default').notNull(),
		name: text('name'),
		start: text('start'),
		referenceId: text('reference_id').notNull(),
		prefix: text('prefix'),
		key: text('key').notNull(),
		refillInterval: integer('refill_interval'),
		refillAmount: integer('refill_amount'),
		lastRefillAt: integer('last_refill_at', { mode: 'timestamp_ms' }),
		enabled: integer('enabled', { mode: 'boolean' }).default(true),
		rateLimitEnabled: integer('rate_limit_enabled', {
			mode: 'boolean',
		}).default(true),
		rateLimitTimeWindow: integer('rate_limit_time_window').default(86400000),
		rateLimitMax: integer('rate_limit_max').default(10),
		requestCount: integer('request_count').default(0),
		remaining: integer('remaining'),
		lastRequest: integer('last_request', { mode: 'timestamp_ms' }),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
		permissions: text('permissions'),
		metadata: text('metadata'),
	},
	(table) => [
		index('hiro_apikeys_configId_idx').on(table.configId),
		index('hiro_apikeys_referenceId_idx').on(table.referenceId),
		index('hiro_apikeys_key_idx').on(table.key),
	],
);

export const authRelations = defineRelationsPart(
	{
		hiro_customers,
		hiro_sessions,
		hiro_accounts,
		hiro_verifications,
		hiro_apikeys,
	},
	(r) => ({
		hiro_customers: {
			hiro_sessions: r.many.hiro_sessions({
				from: r.hiro_customers.id,
				to: r.hiro_sessions.userId,
			}),
			hiro_accounts: r.many.hiro_accounts({
				from: r.hiro_customers.id,
				to: r.hiro_accounts.userId,
			}),
		},
		hiro_sessions: {
			hiro_customer: r.one.hiro_customers({
				from: r.hiro_sessions.userId,
				to: r.hiro_customers.id,
			}),
		},
		hiro_accounts: {
			hiro_customer: r.one.hiro_customers({
				from: r.hiro_accounts.userId,
				to: r.hiro_customers.id,
			}),
		},
	}),
);
