import { spawn } from 'node:child_process';

type Advisory = {
	severity?: string;
	title?: string;
	url?: string;
};

function parseAuditReport(output: string): Record<string, Advisory[]> {
	const jsonStart = output.indexOf('{');

	if (jsonStart === -1) {
		throw new Error('bun audit did not return a JSON report');
	}

	return JSON.parse(output.slice(jsonStart)) as Record<string, Advisory[]>;
}

const audit = spawn('bun', ['audit', '--json']);
let stdout = '';
let stderr = '';

audit.stdout.on('data', (chunk) => {
	stdout += chunk;
});
audit.stderr.on('data', (chunk) => {
	stderr += chunk;
});

const exitCode = await new Promise<number>((resolve, reject) => {
	audit.once('error', reject);
	audit.once('close', (code) => resolve(code ?? 1));
});

if (exitCode !== 0) {
	console.error(stderr || stdout);
	process.exit(exitCode);
}

const report = parseAuditReport(stdout);
const blockingFindings = Object.entries(report).flatMap(
	([packageName, advisories]) =>
		advisories
			.filter(
				(advisory) =>
					advisory.severity === 'critical' || advisory.severity === 'high',
			)
			.map(
				(advisory) =>
					`${advisory.severity}: ${packageName} — ${advisory.title ?? advisory.url ?? 'unknown advisory'}`,
			),
);

if (blockingFindings.length > 0) {
	console.error('High or critical dependency vulnerabilities found:\n');
	console.error(blockingFindings.join('\n'));
	process.exit(1);
}

console.log('No high or critical dependency vulnerabilities found.');
