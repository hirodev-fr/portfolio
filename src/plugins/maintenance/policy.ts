import { resolveEmDashPath } from 'emdash';
import { z } from 'zod';

const maintenanceSchema = z
	.object({
		show_in_maintenance: z.boolean(),
	})
	.transform(({ show_in_maintenance }) => ({
		showInMaintenance: show_in_maintenance,
	}));

export async function isPageAllowedInMaintenance(
	path: string,
): Promise<boolean> {
	const resolved = await resolveEmDashPath(path);

	if (!resolved) {
		return false;
	}

	const parsed = maintenanceSchema.safeParse(resolved.entry.data);

	if (!parsed.success) {
		return false;
	}

	return parsed.data.showInMaintenance;
}
