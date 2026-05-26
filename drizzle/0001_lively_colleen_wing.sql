CREATE TABLE `messages` (
	`id` varchar(64) NOT NULL,
	`senderId` int NOT NULL,
	`content` text NOT NULL,
	`type` enum('text','audio','video','image') NOT NULL DEFAULT 'text',
	`mediaUrl` text,
	`replyToId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reactions` (
	`id` varchar(64) NOT NULL,
	`messageId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`emoji` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `voicePreference` enum('male','female') DEFAULT 'female' NOT NULL;