-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS mombasa_hamlets;

-- Use the created database
USE mombasa_hamlets;

-- Table for players
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  number INT,
  position VARCHAR(255),
  nationality VARCHAR(255),
  age INT,
  height VARCHAR(50),
  weight VARCHAR(50),
  joined DATE,
  previousClub VARCHAR(255),
  image VARCHAR(255),
  appearances INT,
  goals INT,
  assists INT,
  yellowCards INT,
  redCards INT,
  bio TEXT,
  status VARCHAR(255),
  cleanSheets INT,
  saves INT,
  goalsConceded INT,
  tackles INT,
  interceptions INT
);

-- Table for shop products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  originalPrice DECIMAL(10, 2),
  category VARCHAR(255),
  image VARCHAR(255),
  description TEXT,
  sizes VARCHAR(255)
);

-- Table for news articles
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(255),
  summary TEXT,
  category VARCHAR(100),
  is_breaking BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for matches
CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_date DATETIME,
  home_team VARCHAR(255) NOT NULL,
  away_team VARCHAR(255) NOT NULL,
  competition VARCHAR(255),
  venue VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for match results
CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id INT,
  home_score INT,
  away_score INT,
  report TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE SET NULL
);

-- Table for media items
CREATE TABLE IF NOT EXISTS media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  description TEXT,
  media_type VARCHAR(50), -- e.g., 'image', 'video', 'podcast'
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for events
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_date DATETIME,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for admin users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
