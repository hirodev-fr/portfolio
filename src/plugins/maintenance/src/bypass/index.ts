import { getCollectionBypassFlag } from './collection';
import { getEntryBypassFlag } from './entry';

export type SetKVResponse =
	| {
			success: true;
	  }
	| {
			success: false;
			message: string;
	  };

export const isBypassAllowed = async (
	collection: string,
	entryId: string,
): Promise<boolean> => {
	const entryOverride = await getEntryBypassFlag(collection, entryId);
	const collectionDefault = await getCollectionBypassFlag(collection);

	return entryOverride ?? collectionDefault ?? false;
};
