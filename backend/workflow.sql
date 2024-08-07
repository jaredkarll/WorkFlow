-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jul 09, 2024 at 04:10 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `workflow`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `author_id`, `date`) VALUES
(2, 'Mabuhay mga Kababayan!', 'This is it!', NULL, '2024-06-22 04:53:48'),
(3, 'Testing', 'CALL ME KELVIN', 3, '2024-06-27 14:43:38'),
(4, 'Testing 2', 'Calvin Dog', 3, '2024-06-27 14:45:11');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `uploader_id` int(11) NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `filepath` varchar(255) DEFAULT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` enum('file','link') NOT NULL DEFAULT 'file',
  `link` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `project_id`, `uploader_id`, `filename`, `filepath`, `upload_date`, `type`, `link`) VALUES
(24, 2, 0, 'TQP SEO June Report.pdf', '/uploads/TQP SEO June Report.pdf', '2024-07-03 14:23:06', 'file', NULL),
(26, 8, 0, 'message (6).txt', '/uploads/message (6).txt', '2024-07-04 14:22:41', 'file', NULL),
(27, 8, 0, 'photo1716352316.jpeg', '/uploads/photo1716352316.jpeg', '2024-07-04 14:23:16', 'file', NULL),
(28, 2, 3, 'IMG_20240418_111100.jpg', '/uploads/IMG_20240418_111100.jpg', '2024-07-09 13:21:02', 'file', NULL),
(29, 8, 18, 'photo1719278994 (2).jpeg', '/uploads/photo1719278994 (2).jpeg', '2024-07-09 13:51:57', 'file', NULL),
(30, 8, 18, 'photo1719278420.jpeg', '/uploads/photo1719278420.jpeg', '2024-07-09 13:56:52', 'file', NULL),
(31, 2, 18, 'IMG_20240418_111100.jpg', '/uploads/IMG_20240418_111100.jpg', '2024-07-09 13:57:07', 'file', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `progress` int(11) NOT NULL DEFAULT 0,
  `goals` text DEFAULT NULL,
  `methodology` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `progress`, `goals`, `methodology`) VALUES
(2, 'WorkFlow: Task Checklist Website Application for Software and Application Development', 75, 'Matapos na to and makapag japan', 'Di ko alam'),
(8, 'Unilink Project', 100, 'Dasd', 'adsa');

-- --------------------------------------------------------

--
-- Table structure for table `project_members`
--

CREATE TABLE `project_members` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_members`
--

INSERT INTO `project_members` (`id`, `project_id`, `user_id`) VALUES
(69, 2, 11),
(70, 2, 3),
(71, 2, 18),
(72, 8, 8),
(73, 8, 4),
(74, 8, 18);

-- --------------------------------------------------------

--
-- Table structure for table `subtasks`
--

CREATE TABLE `subtasks` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `completed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subtasks`
--

INSERT INTO `subtasks` (`id`, `task_id`, `title`, `completed`) VALUES
(61, 3, 'Create Documentation', 1),
(62, 3, 'Add Table of Contents', 1),
(63, 1, 'Wireframe', 1),
(64, 1, 'Prototyping', 1),
(65, 1, 'Color Scheme', 1),
(66, 1, 'Testing', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `assigned_to` varchar(255) NOT NULL,
  `project_id` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `assigned_to`, `project_id`, `due_date`, `created_at`) VALUES
(1, 'UI/UX Design', 'Taylor Swift', 8, '2024-04-24', '2024-06-22 05:06:13'),
(3, 'Project Documentation', 'Taylor Swift', 2, '2024-06-21', '2024-06-25 14:29:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `password`, `created_at`, `isAdmin`) VALUES
(3, 'cardo@mail.com', 'Cardo', 'Dalisay', '5678', '2024-06-20 11:42:57', 1),
(4, 'admin@example.com', 'Admin', 'User', 'password', '2024-06-20 13:49:44', 1),
(6, 'jane.smith@example.com', 'Jane', 'Smith', 'password123', '2024-06-22 05:06:13', 1),
(7, 'taylor@example.com', 'Taylor', 'Swift', 'password', '2024-06-22 12:23:58', 0),
(8, 'fearless@example.com', 'Fearless', '', 'password', '2024-06-22 12:23:58', 0),
(11, 'taylor@example.com', 'Taylor', 'Swift', 'password', '2024-06-22 12:24:53', 0),
(15, 'taylor@example.com', 'Taylor', 'Swift', 'password', '2024-06-22 12:26:19', 0),
(17, 'speaknow@example.com', 'Speak', 'Now', 'password', '2024-06-22 12:26:19', 0),
(18, 'red@example.com', 'Red', '', 'password', '2024-06-22 12:26:19', 0),
(20, 'adsa@ytyt.com', 'sas', 'adsas', 'asd', '2024-06-29 14:38:47', 1),
(23, 'hatdogmaster69@gmail.com', 'hatdog', 'master', '1234', '2024-07-04 14:21:10', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_members`
--
ALTER TABLE `project_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `subtasks`
--
ALTER TABLE `subtasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `project_members`
--
ALTER TABLE `project_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `subtasks`
--
ALTER TABLE `subtasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Constraints for table `project_members`
--
ALTER TABLE `project_members`
  ADD CONSTRAINT `project_members_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `project_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `subtasks`
--
ALTER TABLE `subtasks`
  ADD CONSTRAINT `subtasks_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
