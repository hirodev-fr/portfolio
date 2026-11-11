import { getPluginSetting, type RouteContext } from 'emdash';
import { getEntryKey } from '../utils';
import type { GetKVResponse, SetKVResponse } from './index';

export const getEntryBypassFlag = async (
	collection: string,
	entryId: string,
): Promise<GetKVResponse> => {
	const key = getEntryKey(collection, entryId);

	try {
		const flag = await getPluginSetting<boolean>('maintenance', key);

		return {
			success: true,
			data: {
				allowBypass: flag ?? false,
			},
		};
	} catch {
		return {
			success: false,
			message: 'Could not get entry bypass flag.',
		};
	}
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
