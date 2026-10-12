import { getPluginSetting } from 'emdash';

export const getEntryBypassFlag = async (collection: string, entryId: string) =>
	await getPluginSetting<boolean>(
		'maintenance',
		`bypass:entry:${collection}:${entryId}`,
	);

export const getCollectionBypassFlag = async (collection: string) =>
	await getPluginSetting<boolean>(
		'maintenance',
		`bypass:collection:${collection}`,
	);

export const isBypassAllowed = async (collection: string, entryId: string) => {
	const entryOverride = await getEntryBypassFlag(collection, entryId);
	const collectionDefault = await getCollectionBypassFlag(collection);

	return entryOverride ?? collectionDefault ?? false;
};
