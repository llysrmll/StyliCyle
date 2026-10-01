CREATE DATABASE IF NOT EXISTS stylicycle CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE stylicycle;

-- Fields match signup.html: first/middle/last name, age, email, password
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(60) NOT NULL,
  middle_name VARCHAR(60) NULL,
  last_name VARCHAR(60) NOT NULL,
  age TINYINT UNSIGNED NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NULL,
  avatar VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fields match rental.html: name, category, size, chest/waist/length, description, photo
CREATE TABLE rentals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  size ENUM('XS','S','M','L','XL','XXL','Custom') NOT NULL,
  chest_cm DECIMAL(5,1) NULL,
  waist_cm DECIMAL(5,1) NULL,
  length_cm DECIMAL(5,1) NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (owner_id), INDEX (status)
);

-- Fields match delivery.html + the map coordinates from delivery.js
CREATE TABLE deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  pickup_address VARCHAR(500) NOT NULL,
  delivery_address VARCHAR(500) NOT NULL,
  pickup_time DATETIME NOT NULL,
  item_type VARCHAR(30) NOT NULL,
  notes TEXT NULL,
  pickup_lat DECIMAL(10,7) NULL,
  pickup_lng DECIMAL(10,7) NULL,
  delivery_lat DECIMAL(10,7) NULL,
  delivery_lng DECIMAL(10,7) NULL,
  status ENUM('scheduled','picked_up','delivered','cancelled') NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (user_id)
);
