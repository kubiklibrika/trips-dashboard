CREATE TABLE `telegramUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chatId` varchar(100) NOT NULL,
	`firstName` varchar(255),
	`username` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `telegramUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `telegramUsers_chatId_unique` UNIQUE(`chatId`)
);
