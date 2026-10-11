import { getPluginSetting } from 'emdash';

type Cache = {
	active: boolean;
	expiresAt: number;
};

let cache: Cache | null = null;
let pending: Promise<boolean> | null = null;

const TTL = 10_000;

export async function isMaintenanceActive(): Promise<boolean> {
	const now = Date.now();

	if (cache && cache.expiresAt > now) {
		return cache.active;
	}

	if (pending) {
		return pending;
	}

	pending = (async () => {
		try {
			const active =
				(await getPluginSetting<boolean>('maintenance', 'active')) ?? false;

			cache = {
				active,
				expiresAt: Date.now() + TTL,
			};

			return active;
		} finally {
			pending = null;
		}
	})();

	return pending;
}
