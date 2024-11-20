-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 19, 2024 at 02:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `food-site`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `food_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'Break Fast'),
(2, 'Lunch'),
(3, 'Dinner'),
(4, 'Snacks'),
(5, 'Dessert'),
(19, 'Hot Coffees');

-- --------------------------------------------------------

--
-- Table structure for table `food_items`
--

CREATE TABLE `food_items` (
  `food_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food_items`
--

INSERT INTO `food_items` (`food_id`, `name`, `description`, `price`, `category`, `image_url`, `available`, `created_at`) VALUES
(19, 'French fries', 'Lorem ipsum dolor sit amet consectetur adipiscing elit vulputate phasellus eget orci feugiat, tincidunt inceptos erat per magnis habitasse volutpat ac tempus ultrices dapibus, et lacinia id etiam nibh turpis commodo sed mollis eu laoreet. Congue feugiat sollicitudin lectus etiam fermentum rhoncus maecenas libero vehicula litora, varius tortor rutrum auctor est justo vestibulum ridiculus sagittis aliquam quis, ege', 22.00, 1, 'french-fries17-11-2024-07-39-40.jpg', 4, '2024-11-17 06:34:07'),
(22, 'Greek Salaad', 'Lorem ipsum dolor sit amet consectetur adipiscing elit, sociosqu magnis tristique donec per rutrum vestibulum integer, fermentum sociis ridiculus dui blandit tellus. Curae maecenas est mauris purus proin mattis litora porta tristique metus consequat euismod, arcu congue eu volutpat molestie risus nulla in odio lacus convallis. Donec magna tempor sociosqu gravida curabitur ligula nibh, taciti lobortis mattis ac quam cras, velit class aliquam metus proin hendrerit.', 22.00, 3, 'greek-salad17-11-2024-07-40-06.jpg', 6, '2024-11-17 06:40:35'),
(23, 'Spaghetti Bolugnese', 'Lorem ipsum dolor sit amet consectetur adipiscing elit, sociosqu magnis tristique donec per rutrum vestibulum integer, fermentum sociis ridiculus dui blandit tellus. Curae maecenas est mauris purus proin mattis litora porta tristique metus consequat euismod, arcu congue eu volutpat molestie risus nulla in odio lacus convallis. Donec magna tempor sociosqu gravida curabitur ligula nibh, taciti lobortis mattis ac quam cras, velit class aliquam metus proin hendrerit.', 43.00, 1, 'spaghetti-bolugnese17-11-2024-07-41-11.jpg', 4, '2024-11-17 06:41:45'),
(24, 'Veggie Omelette', 'Lorem ipsum dolor sit amet consectetur adipiscing elit, sociosqu magnis tristique donec per rutrum vestibulum integer, fermentum sociis ridiculus dui blandit tellus. Curae maecenas est mauris purus proin mattis litora porta tristique metus consequat euismod, arcu congue eu volutpat molestie risus nulla in odio lacus convallis. Donec magna tempor sociosqu gravida curabitur ligula nibh, taciti lobortis mattis ac quam cras, velit class aliquam metus proin hendrerit.', 32.00, 5, 'Veggie-Omelette17-11-2024-07-42-01.jpg', 5, '2024-11-17 06:42:24'),
(25, 'Grilled Chicken Sandwich', 'Lorem ipsum dolor sit amet consectetur adipiscing elit, sociosqu magnis tristique donec per rutrum vestibulum integer, fermentum sociis ridiculus dui blandit tellus. Curae maecenas est mauris purus proin mattis litora porta tristique metus consequat euismod, arcu congue eu volutpat molestie risus nulla in odio lacus convallis. Donec magna tempor sociosqu gravida curabitur ligula nibh, taciti lobortis mattis ac quam cras, velit class aliquam metus proin hendrerit.', 33.00, 19, 'Grilled-Chicken-Sandwich17-11-2024-07-42-47.jpg', 0, '2024-11-17 06:43:12'),
(26, 'Red Velvet Cake', 'Lorem ipsum dolor sit amet consectetur adipiscing elit, sociosqu magnis tristique donec per rutrum vestibulum integer, fermentum sociis ridiculus dui blandit tellus. Curae maecenas est mauris purus proin mattis litora porta tristique metus consequat euismod, arcu congue eu volutpat molestie risus nulla in odio lacus convallis. Donec magna tempor sociosqu gravida curabitur ligula nibh, taciti lobortis mattis ac quam cras, velit class aliquam metus proin hendrerit.', 31.00, 1, 'red-velvet-cake-4917734_64017-11-2024-07-43-27.jpg', 2, '2024-11-17 06:43:51'),
(27, 'Mango Shake', 'Lorem ipsum dolor sit amet consectetur adipiscing elit, sociosqu magnis tristique donec per rutrum vestibulum integer, fermentum sociis ridiculus dui blandit tellus. Curae maecenas est mauris purus proin mattis litora porta tristique metus consequat euismod, arcu congue eu volutpat molestie risus nulla in odio lacus convallis. Donec magna tempor sociosqu gravida curabitur ligula nibh, taciti lobortis mattis ac quam cras, velit class aliquam metus proin hendrerit.', 14.00, 1, 'mango-3380631_64017-11-2024-07-46-20.jpg', 2, '2024-11-17 06:46:43'),
(28, 'Nachos', 'Lorem ipsum dolor sit amet consectetur adipiscing elit, sociosqu magnis tristique donec per rutrum vestibulum integer, fermentum sociis ridiculus dui blandit tellus. Curae maecenas est mauris purus proin mattis litora porta tristique metus consequat euismod, arcu congue eu volutpat molestie risus nulla in odio lacus convallis. Donec magna tempor sociosqu gravida curabitur ligula nibh, taciti lobortis mattis ac quam cras, velit class aliquam metus proin hendrerit.', 25.00, 5, 'nachos-4454941_64017-11-2024-07-47-09.jpg', 3, '2024-11-17 06:47:27'),
(29, 'Fries of French', 'Lorem ipsum dolor sit amet consectetur adipiscing elit, sociosqu magnis tristique donec per rutrum vestibulum integer, fermentum sociis ridiculus dui blandit tellus. Curae maecenas est mauris purus proin mattis litora porta tristique metus consequat euismod, arcu congue eu volutpat molestie risus nulla in odio lacus convallis. Donec magna tempor sociosqu gravida curabitur ligula nibh, taciti lobortis mattis ac quam cras, velit class aliquam metus proin hendrerit.', 43.00, 4, 'french-fries17-11-2024-07-48-00.jpg', 4, '2024-11-17 06:48:20');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `food_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','completed','canceled') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `food_id`, `total_price`, `order_date`, `status`) VALUES
(13, 17, 26, 31.00, '2024-11-19 11:11:20', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `food_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `review_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(9, 'munazzam', 'webmunazzam@gmail.com', '$2y$10$0pHuqFF56jApEdOUpLxHB.z.y7rscID64wPp4ySZqDCzgZ2N5vPXO', 'admin', '2024-11-10 07:04:18'),
(10, 'iftikhar', 'iftikhar123@gmail.com', '$2y$10$I0fHKET.f9zesASo/BjaaeCIEBURuz8HUMBJwkOvpxF7ZfgKM/Y4S', 'customer', '2024-11-10 07:05:32'),
(17, 'shahid', 'shahid123@gmail.com', '$2y$10$46F1dxDVpi0oAZT1xtLEJu.kaRJ14SjXnsq6uHfPvsIQXVzXRw.rS', 'customer', '2024-11-19 07:49:13'),
(18, 'shamas', 'shamas123@gmail.com', '$2y$10$hdjT3.pXRywKGdyp4yFix.i4I7sWWsrjqSPa4mZ8jLleFEZBnlcf.', 'admin', '2024-11-19 11:56:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `food_id` (`food_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `name` (`category_name`) USING HASH;

--
-- Indexes for table `food_items`
--
ALTER TABLE `food_items`
  ADD PRIMARY KEY (`food_id`),
  ADD KEY `category_id` (`category`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `food_id` (`food_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `food_items`
--
ALTER TABLE `food_items`
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food_items` (`food_id`);

--
-- Constraints for table `food_items`
--
ALTER TABLE `food_items`
  ADD CONSTRAINT `food_items_ibfk_1` FOREIGN KEY (`category`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food_items` (`food_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
