import { getPluginSetting, type RouteContext } from 'emdash';
import { getCollectionKey, getEntryKey } from './utils';

type Response =
	| {
			success: true;
	  }
	| {
			success: false;
			message: string;
	  };

export const getEntryBypassFlag = async (
	collection: string,
	entryId: string,
): Promise<boolean> => {
	const key = getEntryKey(collection, entryId);

	const flag = await getPluginSetting<boolean>('maintenance', key);

	return flag ?? false;
};

export const setEntryBypassFlag = async (
	ctx: RouteContext,
	input: { collection: string; entryId: string; value: boolean },
): Promise<Response> => {
	const { collection, entryId, value } = input;

	const key = getEntryKey(collection, entryId);

	try {
		await ctx.settings.set(key, value);
		return {
			success: true,
		};
	} catch {
		return {
			success: false,
			message: 'Could not set entry bypass flag.',
		};
	}
};

export const getCollectionBypassFlag = async (
	collection: string,
): Promise<boolean> => {
	const key = getCollectionKey(collection);

	const flag = await getPluginSetting<boolean>('maintenance', key);

	return flag ?? false;
};

export const setCollectionBypassFlag = async (
	ctx: RouteContext,
	input: { collection: string; value: boolean },
): Promise<Response> => {
	const { collection, value } = input;

	const key = getCollectionKey(collection);

	try {
		await ctx.settings.set(key, value);
		return {
			success: true,
		};
	} catch {
		return {
			success: false,
			message: 'Could not set collection bypass flag.',
		};
	}
};

export const isBypassAllowed = async (
	collection: string,
	entryId: string,
): Promise<boolean> => {
	const entryOverride = await getEntryBypassFlag(collection, entryId);
	const collectionDefault = await getCollectionBypassFlag(collection);

	return entryOverride ?? collectionDefault ?? false;
};
