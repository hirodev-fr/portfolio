const required = [
	'EMDASH_SITE_URL',
	'S3_ENDPOINT',
	'S3_BUCKET',
	'S3_ACCESS_KEY_ID',
	'S3_SECRET_ACCESS_KEY',
	'S3_REGION',
	'S3_PUBLIC_URL',
];

{
	for (const name of required) {
		if (!process.env[name]?.trim()) throw new Error(`${name} is required`);
	}
	if (process.env.EMDASH_SITE_URL !== 'https://hirodev.fr') {
		throw new Error('EMDASH_SITE_URL must be https://hirodev.fr');
	}
	for (const name of ['S3_ENDPOINT', 'S3_PUBLIC_URL']) {
		let url;
		try {
			url = new URL(process.env[name]);
		} catch {
			throw new Error(`${name} must be a valid HTTPS URL`);
		}
		if (
			url.protocol !== 'https:' ||
			url.username ||
			url.password ||
			url.search ||
			url.hash
		) {
			throw new Error(
				`${name} must be a valid HTTPS URL without credentials, query or fragment`,
			);
		}
	}
}

await import('../dist/server/entry.mjs');
