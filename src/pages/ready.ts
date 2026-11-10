import { getPluginSetting } from 'emdash';

export async function GET() {
	try {
		await getPluginSetting('maintenance', 'active');
		return new Response('OK', { headers: { 'Cache-Control': 'no-store' } });
	} catch {
		return new Response('Not ready', {
			status: 503,
			headers: { 'Cache-Control': 'no-store' },
		});
	}
}
