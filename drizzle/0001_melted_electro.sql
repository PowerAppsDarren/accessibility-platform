CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` varchar(500),
	`departmentId` int,
	`contactName` varchar(255),
	`vendorId` int,
	`lastContactDate` date,
	`vpatOrAcr` boolean DEFAULT false,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`departmentHeadId` int,
	`managerId` int,
	`lastContactDate` date,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `departments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `people` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`departmentId` int,
	`lastContactDate` date,
	`champion` enum('No','In Progress','Yes') DEFAULT 'No',
	`levelAccessAccount` enum('No','In Progress','On hold','Troubleshooting','Complete') DEFAULT 'No',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `people_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `websites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` varchar(500),
	`departmentId` int,
	`contactId` int,
	`managerId` int,
	`lastContactDate` date,
	`ownerId` int,
	`archived` boolean DEFAULT false,
	`accessibilityReviewed` boolean DEFAULT false,
	`siteimproveScore` int,
	`manualReview` boolean DEFAULT false,
	`remediationPlan` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `websites_id` PRIMARY KEY(`id`)
);
