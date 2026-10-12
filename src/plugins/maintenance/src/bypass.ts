import { getPluginSetting } from 'emdash';
import { getCollectionKey, getEntryKey } from './utils';

export const getEntryBypassFlag = async (
	collection: string,
	entryId: string,
): Promise<boolean> => {
	const key = getEntryKey(collection, entryId);

	const flag = await getPluginSetting<boolean>('maintenance', key);

	return flag ?? false;
};

export const getCollectionBypassFlag = async (
	collection: string,
): Promise<boolean> => {
	const key = getCollectionKey(collection);

	const flag = await getPluginSetting<boolean>('maintenance', key);

	return flag ?? false;
};

export const isBypassAllowed = async (
	collection: string,
	entryId: string,
): Promise<boolean> => {
	const entryOverride = await getEntryBypassFlag(collection, entryId);
	const collectionDefault = await getCollectionBypassFlag(collection);

	return entryOverride ?? collectionDefault ?? false;
};
