import '../.astro/types.d.ts';

declare global {
	namespace App {
		interface Locals {
			customerUser: import('better-auth').User | null;
			customerSession: import('better-auth').Session | null;
		}
	}
}
