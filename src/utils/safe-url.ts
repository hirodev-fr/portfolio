const URL_SCHEME = /^[a-z][a-z\d+.-]*:/i;
const ALLOWED_URL_SCHEME = /^(https?:|mailto:|tel:)/i;

export function safeUrl(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	const url = value.trim();
	if (
		!url ||
		Array.from(url).some((character) => {
			const code = character.charCodeAt(0);
			return code <= 32 || code === 127 || character === '\\';
		})
	)
		return undefined;
	if (url.startsWith('//')) return undefined;
	if (URL_SCHEME.test(url)) {
		return ALLOWED_URL_SCHEME.test(url) ? url : undefined;
	}
	return url;
}
