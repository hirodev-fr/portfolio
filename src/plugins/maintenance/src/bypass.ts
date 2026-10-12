import { getPluginSetting } from 'emdash';

export const getEntryBypassFlag = (collection: string, entryId: string) =>
	getPluginSetting<boolean>(
		'maintenance',
		`bypass:entry:${collection}:${entryId}`,
	);

export const getCollectionBypassFlag = (collection: string) =>
	getPluginSetting<boolean>('maintenance', `bypass:collection:${collection}`);

export const isBypassAllowed = (collection: string, entryId: string) => {
	const entryOverride = getEntryBypassFlag(collection, entryId);
	const collectionDefault = getCollectionBypassFlag(collection);

	return entryOverride ?? collectionDefault ?? false;
};
