import type { AstroIntegration } from 'astro';
import type { DatabaseDescriptor } from 'emdash';
import type { StorageDescriptor } from 'emdash/astro';

// cloudflare
import cloudflare from '@astrojs/cloudflare';
import { d1, r2 } from '@emdash-cms/cloudflare';

// node
import node from '@astrojs/node';
import { sqlite } from 'emdash/db';
import { local } from 'emdash/astro';

type AdapterType = 'node' | 'cloudflare';

interface Adapter {
	mode: AstroIntegration;
	database: DatabaseDescriptor;
	storage: StorageDescriptor;
}

export function loadAdapter(type: AdapterType): Adapter {
	switch (type) {
		case 'node':
			return {
				mode: node({ mode: 'standalone' }),
				database: sqlite({ url: 'file:./data/data.db' }),
				storage: local({ directory: './data/uploads', baseUrl: '/_emdash/api/media/file' }),
			};

		case 'cloudflare':
			return {
				mode: cloudflare(),
				database: d1({ binding: 'DB' }),
				storage: r2({ binding: 'MEDIA' }),
			};
	}
}
