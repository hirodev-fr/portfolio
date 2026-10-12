import { getPluginSetting, type RouteContext } from 'emdash';
import { getCollectionKey } from '../utils';
import type { GetKVResponse, SetKVResponse } from './index';

export const getCollectionBypassFlag = async (
	collection: string,
): Promise<GetKVResponse> => {
	const key = getCollectionKey(collection);

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
			message: 'Could not get collection bypass flag.',
		};
	}
};

export const setCollectionBypassFlag = async (
	ctx: RouteContext,
	input: { collection: string; value: boolean },
): Promise<SetKVResponse> => {
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
