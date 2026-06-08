-- Global Analytics Platform - Database Setup
-- Run: mysql -u root -p < database/init.sql

CREATE DATABASE IF NOT EXISTS global_analytics_platform
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'analytics_user'@'localhost' IDENTIFIED BY 'analytics_pass';
GRANT ALL PRIVILEGES ON global_analytics_platform.* TO 'analytics_user'@'localhost';
FLUSH PRIVILEGES;
