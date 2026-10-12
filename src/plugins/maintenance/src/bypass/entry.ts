import { getPluginSetting, type RouteContext } from 'emdash';
import { getEntryKey } from '../utils';
import type { SetKVResponse } from './index';

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
): Promise<SetKVResponse> => {
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
