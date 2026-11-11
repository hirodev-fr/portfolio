import { getCollectionBypassFlag } from './collection';
import { getEntryBypassFlag } from './entry';

export type GetKVResponse =
	| {
			success: true;
			data: {
				allowBypass: boolean;
			};
	  }
	| {
			success: false;
			message: string;
	  };

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

	if (entryOverride.success) return entryOverride.data.allowBypass;

	const collectionDefault = await getCollectionBypassFlag(collection);

	if (collectionDefault.success) return collectionDefault.data.allowBypass;

	return false;
};
