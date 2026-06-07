import { useState, useEffect } from 'react';
import { usePluginAPI } from '../lib/api';

export function SettingsPage() {
	const api = usePluginAPI();
	const [settings, setSettings] = useState<Record<string, unknown>>({});
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		api
			.get('settings')
			.then((data) => {
				setSettings(data || {});
			})
			.catch((err) => {
				console.error(err);
				setError('Impossible de charger les paramètres.');
			});
	}, []);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setSaved(false);
		setError(null);
		try {
			await api.post('settings/save', settings);
			setSaved(true);
		} catch (err: any) {
			console.error(err);
			setError(err.message || 'Une erreur est survenue lors de la sauvegarde.');
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			<div className="md:flex md:items-center md:justify-between mb-8">
				<div className="flex-1 min-w-0">
					<h2 className="text-2xl font-bold leading-7 text-zinc-950 sm:text-3xl sm:truncate dark:text-white font-sans">
						Configuration de Hiro
					</h2>
					<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
						Gérez les adresses email de contact et de conformité RGPD du site.
					</p>
				</div>
			</div>

			<form onSubmit={handleSave} className="space-y-6">
				{saved && (
					<div className="rounded-md bg-emerald-50 p-4 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
						<div className="flex">
							<div className="shrink-0">
								<svg className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
									Paramètres enregistrés avec succès.
								</p>
							</div>
						</div>
					</div>
				)}

				{error && (
					<div className="rounded-md bg-red-50 p-4 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
						<div className="flex">
							<div className="shrink-0">
								<svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
							</div>
						</div>
					</div>
				)}

				<div className="bg-white shadow sm:rounded-lg border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
					<div className="px-4 py-5 sm:p-6 space-y-6">
						<div>
							<label
								htmlFor="contactEmail"
								className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
							>
								Email de contact
							</label>
							<div className="mt-2">
								<input
									type="email"
									name="contactEmail"
									id="contactEmail"
									className="block w-full rounded-md border-0 py-1.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
									placeholder="contact@hirodev.fr"
									value={(settings.contactEmail as string) || ''}
									onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
									required
								/>
							</div>
							<p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
								Cette adresse email est utilisée pour les demandes de contact générales.
							</p>
						</div>

						<div>
							<label
								htmlFor="RGPDEmail"
								className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
							>
								Email RGPD
							</label>
							<div className="mt-2">
								<input
									type="email"
									name="RGPDEmail"
									id="RGPDEmail"
									className="block w-full rounded-md border-0 py-1.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
									placeholder="rgpd@hirodev.fr"
									value={(settings.RGPDEmail as string) || ''}
									onChange={(e) => setSettings({ ...settings, RGPDEmail: e.target.value })}
									required
								/>
							</div>
							<p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
								Cette adresse email reçoit les demandes concernant la vie privée et les droits sur
								les données personnelles.
							</p>
						</div>
					</div>

					<div className="flex items-center justify-end gap-x-6 border-t border-zinc-200 px-4 py-4 sm:px-6 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
						<button
							type="submit"
							disabled={saving}
							className="inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{saving ? (
								<div className="flex items-center">
									<svg
										className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Enregistrement...
								</div>
							) : (
								'Enregistrer'
							)}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
