import { type CollectionResult } from 'emdash';

export const sortCollectionByIndex = <P extends CollectionResult<T>, T extends { index: number }>(
	collection: P,
	sortBy: 'ascendant' | 'descendant' = 'ascendant',
) => {
	const sorted = collection.entries.sort((a, b) =>
		a.data.index > b.data.index
			? sortBy === 'ascendant'
				? 1
				: -1
			: sortBy === 'ascendant'
				? -1
				: 1,
	);
	return { ...collection, entries: sorted };
};
