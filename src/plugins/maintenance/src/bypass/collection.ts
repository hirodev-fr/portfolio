import { getPluginSetting, type RouteContext } from 'emdash';
import { getCollectionKey } from '../utils';
import type { Response } from './index';

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
