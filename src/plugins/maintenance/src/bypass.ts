import { getPluginSetting } from 'emdash';

export const getEntryOverride = (collection: string, entryId: string) =>
	getPluginSetting<boolean>(
		'maintenance',
		`bypass:entry:${collection}:${entryId}`,
	);

export const getCollectionDefault = (collection: string) =>
	getPluginSetting<boolean>('maintenance', `bypass:collection:${collection}`);

export const isBypassAllowed = (collection: string, entryId: string) => {
	const entryOverride = getEntryOverride(collection, entryId);
	const collectionDefault = getCollectionDefault(collection);

	return entryOverride ?? collectionDefault ?? false;
};
