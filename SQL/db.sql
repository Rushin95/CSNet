CREATE DATABASE IF NOT EXISTS CSNet;

USE CSNet;

DROP TABLE IF EXISTS `user_details`;
CREATE TABLE `user_details` (
  `user_id` INT(10) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NULL,
  `f_name` varchar(255) NULL,
  `l_name` varchar(255) NULL,
  `password` varchar(255) NULL,
  `company` varchar(255) NULL,
  `contact` varchar(255) NULL,
  PRIMARY KEY (`user_id`)
);

DROP TABLE IF EXISTS `app_details`;
CREATE TABLE `app_details` (
  `app_id` INT(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NULL,
  `owner` INT(10),
  PRIMARY KEY (`app_id`)
);

DROP TABLE IF EXISTS `role_details`;
CREATE TABLE `role_details` (
  `role_id` INT(10) NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NULL,
  `level` INT(1),
  `description` varchar(255) NULL,
  `name` varchar(255) NULL,
  `email` varchar(255) NULL,
  `login` varchar(255) NULL,
  `password` varchar(255) NULL,
  `appid` INT(10),
  PRIMARY KEY (`role_id`)
);

DROP TABLE IF EXISTS `msg_details`;
CREATE TABLE `msg_details` (
  `msg_id` INT(10) NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NULL,
  `message` varchar(10000) NULL,
  `timestamp` TIMESTAMP,
  `sender` INT(10),
  `receiver` INT(10),
  PRIMARY KEY (`msg_id`)
);

DROP TABLE IF EXISTS `post_details`;
CREATE TABLE `post_details` (
  `post_id` INT(10) NOT NULL AUTO_INCREMENT,
  `post` varchar(10000) NULL,
  `timestamp` TIMESTAMP,
  `owner` INT(10),
  `is_public` BOOLEAN,
  PRIMARY KEY (`post_id`)
);
