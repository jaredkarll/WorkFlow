-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jun 29, 2024 at 05:19 PM
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
(1, 'Welcome to MGHS!', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit dictum justo, eget sollicitudin purus viverra sit amet. Curabitur a eleifend justo, vitae congue turpis. Mauris eget ipsum nibh.', 1, '2024-06-20 13:50:05'),
(2, 'Mabuhay mga Kababayan!', 'This is it!', 1, '2024-06-22 04:53:48'),
(3, 'Testing', 'CALL ME KELVIN', 3, '2024-06-27 14:43:38'),
(4, 'Testing 2', 'Calvin Klein', 3, '2024-06-27 14:45:11');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `filepath` varchar(255) DEFAULT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` enum('file','link') NOT NULL DEFAULT 'file',
  `link` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `project_id`, `filename`, `filepath`, `upload_date`, `type`, `link`) VALUES
(1, 2, 'Confim', '/uploads/Confim', '2024-06-23 07:57:44', 'file', NULL),
(2, 8, 'hatdog69-message.txt', '/uploads/hatdog69-message.txt', '2024-06-24 13:18:21', 'file', NULL),
(4, 8, '1719236918350-Gmail - We Miss You! Reconfirm Your Subscription to Stay Inspired.pdf', '/uploads/1719236918350-Gmail - We Miss You! Reconfirm Your Subscription to Stay Inspired.pdf', '2024-06-24 13:48:38', 'file', NULL),
(12, 2, '1719316324906-DNG YT Banner Final.jpg', '/uploads/1719316324906-DNG YT Banner Final.jpg', '2024-06-25 11:52:04', 'file', NULL),
(13, 2, NULL, NULL, '2024-06-25 11:52:20', 'link', 'https://chatgpt.com/c/77ab82bb-4e15-4de2-bbbb-437ece5759ea'),
(14, 8, '1719318014381-message (1).txt', '/uploads/1719318014381-message (1).txt', '2024-06-25 12:20:14', 'file', NULL),
(16, 2, '1719318188908-copperhead.jpg', '/uploads/1719318188908-copperhead.jpg', '2024-06-25 12:23:08', 'file', NULL);

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
(3, 'WorkFlow: Task Checklist Website Application for Software and Application Development', 100, 'hehe', 'hehe'),
(4, 'WorkFlow: Task Checklist Website Application for Software and Application Development', 75, 'SARAP', 'IDK'),
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
(44, 2, 11),
(45, 2, 3),
(46, 2, 18),
(63, 8, 8),
(64, 8, 4),
(67, 4, 11),
(68, 3, 7);

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
(43, 1, 'Wireframe', 1),
(44, 1, 'Prototyping', 1),
(45, 1, 'Color Scheme', 1),
(46, 1, 'Testing', 1),
(55, 3, 'Create Documentation', 0);

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
(1, 'UI/UX Design', 'Taylor Swift', 0, '2024-04-26', '2024-06-22 05:06:13'),
(3, 'Project Documentation', 'John Doe', 0, '2024-06-23', '2024-06-25 14:29:32');

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
(1, 'testing@gmail.com', 'Jonel', 'Meow', '1234', '2024-06-16 08:34:12', 0),
(3, 'cardo@mail.com', 'Cardo', 'Dalisay', '5678', '2024-06-20 11:42:57', 1),
(4, 'admin@example.com', 'Admin', 'User', 'password', '2024-06-20 13:49:44', 1),
(5, 'john.doe@example.com', 'John', 'Doe', 'password123', '2024-06-22 05:06:13', 0),
(6, 'jane.smith@example.com', 'Jane', 'Smith', 'password123', '2024-06-22 05:06:13', 1),
(7, 'taylor@example.com', 'Taylor', 'Swift', 'password', '2024-06-22 12:23:58', 0),
(8, 'fearless@example.com', 'Fearless', '', 'password', '2024-06-22 12:23:58', 0),
(10, 'red@example.com', 'Red', '', 'password', '2024-06-22 12:23:58', 0),
(11, 'taylor@example.com', 'Taylor', 'Swift', 'password', '2024-06-22 12:24:53', 0),
(12, 'fearless@example.com', 'Fearless', '', 'password', '2024-06-22 12:24:53', 0),
(13, 'speaknow@example.com', 'Speak', 'Now', 'password', '2024-06-22 12:24:53', 0),
(14, 'red@example.com', 'Red', '', 'password', '2024-06-22 12:24:53', 0),
(15, 'taylor@example.com', 'Taylor', 'Swift', 'password', '2024-06-22 12:26:19', 0),
(16, 'fearless@example.com', 'Fearless', '', 'password', '2024-06-22 12:26:19', 0),
(17, 'speaknow@example.com', 'Speak', 'Now', 'password', '2024-06-22 12:26:19', 0),
(18, 'red@example.com', 'Red', '', 'password', '2024-06-22 12:26:19', 0),
(19, 'hatdog@123.com', 'hatdogmaster', 'sixty-nine', '134', '2024-06-29 14:22:11', 0),
(20, 'adsa@ytyt.com', 'sas', 'adsas', 'asd', '2024-06-29 14:38:47', 1),
(21, '69@420.com', 'hatdog', 'hatdog', '12345', '2024-06-29 15:13:52', 0);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `project_members`
--
ALTER TABLE `project_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `subtasks`
--
ALTER TABLE `subtasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
