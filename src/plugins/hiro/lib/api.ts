import { ofetch } from 'ofetch';

export function usePluginAPI() {
	const client = ofetch.create({
		baseURL: '/_emdash/api/plugins/hiro',
		headers: {
			'X-EmDash-Request': '1',
		},
		onResponse({ response }) {
			if (
				response.ok &&
				response._data &&
				typeof response._data === 'object' &&
				'data' in response._data
			) {
				response._data = response._data.data;
			}
		},
	});

	return {
		get: <T = any>(url: string): Promise<T> => client(url, { method: 'GET' }),
		post: <T = any>(url: string, body?: any): Promise<T> => client(url, { method: 'POST', body }),
		put: <T = any>(url: string, body?: any): Promise<T> => client(url, { method: 'PUT', body }),
		delete: <T = any>(url: string): Promise<T> => client(url, { method: 'DELETE' }),
	};
}
