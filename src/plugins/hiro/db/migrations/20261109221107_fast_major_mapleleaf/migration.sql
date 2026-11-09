ALTER TABLE `hiro_sessions` ADD `impersonated_by` text;--> statement-breakpoint
ALTER TABLE `hiro_customers` ADD `role` text;--> statement-breakpoint
ALTER TABLE `hiro_customers` ADD `banned` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `hiro_customers` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `hiro_customers` ADD `ban_expires` integer;