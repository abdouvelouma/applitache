-- Fichier d'initialisation MySQL pour Docker
-- Ce fichier crée les tables et les indexes

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  avatar VARCHAR(255),
  isActive BOOLEAN DEFAULT true,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('à faire', 'en cours', 'terminée') DEFAULT 'à faire' NOT NULL,
  priority ENUM('basse', 'moyenne', 'haute') DEFAULT 'moyenne' NOT NULL,
  dueDate DATETIME,
  userId INT NOT NULL,
  completedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer des utilisateurs de test (passwords: password123, password456, password789)
INSERT INTO users (email, username, firstName, lastName, isActive, createdAt, updatedAt) VALUES
('alice@example.com', 'alice', 'Alice', 'Dupont', true, NOW(), NOW()),
('bob@example.com', 'bob', 'Bob', 'Martin', true, NOW(), NOW()),
('carol@example.com', 'carol', 'Carol', 'Pierre', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt=NOW();
