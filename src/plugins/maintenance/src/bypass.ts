import { getPluginSetting } from 'emdash';

export const getEntryBypassFlag = async (
	collection: string,
	entryId: string,
): Promise<boolean> =>
	(await getPluginSetting<boolean>(
		'maintenance',
		`bypass:entry:${collection}:${entryId}`,
	)) ?? false;

export const getCollectionBypassFlag = async (
	collection: string,
): Promise<boolean> =>
	(await getPluginSetting<boolean>(
		'maintenance',
		`bypass:collection:${collection}`,
	)) ?? false;

export const isBypassAllowed = async (
	collection: string,
	entryId: string,
): Promise<boolean> => {
	const entryOverride = await getEntryBypassFlag(collection, entryId);
	const collectionDefault = await getCollectionBypassFlag(collection);

	return entryOverride ?? collectionDefault ?? false;
};
