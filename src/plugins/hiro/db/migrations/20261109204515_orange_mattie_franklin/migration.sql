ALTER TABLE `account` RENAME TO `hiro_accounts`;--> statement-breakpoint
ALTER TABLE `session` RENAME TO `hiro_sessions`;--> statement-breakpoint
ALTER TABLE `user` RENAME TO `hiro_customers`;--> statement-breakpoint
ALTER TABLE `verification` RENAME TO `hiro_verifications`;--> statement-breakpoint
DROP INDEX IF EXISTS `account_userId_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `session_userId_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `verification_identifier_idx`;--> statement-breakpoint
CREATE INDEX `hiro_accounts_userId_idx` ON `hiro_accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `hiro_sessions_userId_idx` ON `hiro_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `hiro_verifications_identifier_idx` ON `hiro_verifications` (`identifier`);