import { z } from 'zod';

const envSchema = z.object({
	// build
	ENV_ADAPTER: z.enum(['node', 'cloudflare']).default('node'),

	// emdash
	EMDASH_ENCRYPTION_KEY: z.string().startsWith('emdash_'),
	EMDASH_SITE_URL: z.string().optional(),
	EMDASH_ALLOWED_ORIGINS: z.string().optional(),
	EMDASH_DATABASE_URL: z.string().optional(),
	EMDASH_PREVIEW_SECRET: z.string().optional(),
	EMDASH_IP_SALT: z.string().optional(),
	EMDASH_URL: z.string().optional(),

	// in build flags
	IN_BUILD: z.coerce.boolean().default(false),
	ALLOW_POLICIES_IN_BUILD: z.coerce.boolean().default(false),

	// db
	DATABASE_URL: z.string(),

	// umami
	VITE_UMAMI_WEBSITE_ID: z.string().optional(),
	VITE_UMAMI_SCRIPT_URL: z.string().optional(),
});

const rawEnv = { ...process.env };

if (typeof process !== 'undefined' && !process.env.EMDASH_ENCRYPTION_KEY) {
	try {
		const viteModule = 'vite';
		const { loadEnv } = await import(/* @vite-ignore */ viteModule);
		const loaded = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
		Object.assign(rawEnv, loaded);
	} catch {}
}

export const env = envSchema.parse(rawEnv);
