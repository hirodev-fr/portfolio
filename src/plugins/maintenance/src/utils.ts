export const getEntryKey = (collection: string, entryId: string): string => {
	return `bypass:entry:${collection}:${entryId}`;
};

export const getCollectionKey = (collection: string): string => {
	return `bypass:collection:${collection}`;
};
