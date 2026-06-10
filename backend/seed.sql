-- SQL script to populate the ultrapub database
-- You can run this directly in phpMyAdmin, MySQL Workbench, or via MySQL command line.

-- Select database
USE ultrapub;

-- Disable foreign key checks to prevent insertion order errors during clean up
SET FOREIGN_KEY_CHECKS = 0;

-- Optional: Clean existing data (uncomment if you want a fresh start)
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE devis;
-- TRUNCATE TABLE commandes;
-- TRUNCATE TABLE clients;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert default admin user (username: admin, password: Admin123!, role: ROLE_ADMIN)
-- The password is BCrypt hashed.
INSERT INTO users (username, password, role)
SELECT 'admin', '$2a$10$wU0T5XWzI.g0VvPky7HaeurW7o1gH1qF9b.B0q88Mv99s2q4tD69a', 'ROLE_ADMIN'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- 2. Insert clients
INSERT INTO clients (id, nom, telephone, email, adresse, societe, date_creation) VALUES
(1, 'Jean Dupont', '0612345678', 'jean.dupont@gmail.com', '10 Rue de la Paix, 75002 Paris', 'Dupont & Co', NOW()),
(2, 'Sarah Amrani', '0522345678', 's.amrani@outlook.com', '20 Boulevard d\'Anfa, Casablanca', 'Amrani Digital', NOW()),
(3, 'Mohamed El Fassi', '0661987654', 'mohamed.elfassi@gmail.com', '15 Avenue des FAR, Rabat', 'Maroc Neon Solutions', NOW())
ON DUPLICATE KEY UPDATE id=id;

-- Reset Auto-Increment for clients if needed
ALTER TABLE clients AUTO_INCREMENT = 4;

-- 3. Insert quotes (devis)
INSERT INTO devis (id, client_id, type_panneau, dimensions, matiere, prix, description, statut, file_url, date_creation) VALUES
(1, 1, 'Néon LED', '120x40 cm', 'Acrylique & Silicone', 4500.00, 'Enseigne lumineuse logo ''Dupont & Co'' couleur rouge neon.', 'VALIDE', NULL, NOW()),
(2, 2, 'Lettres 3D Relief', '300x80 cm', 'Inox poli miroir rétroéclairé', 12000.00, 'Enseigne extérieure en lettres boîtiers inox poli avec effet halo lumineux blanc chaud.', 'EN_COURS', NULL, NOW()),
(3, 3, 'Caisson Lumineux', '150x150 cm', 'Profilé alu, bâche tendue diffusante', 6800.00, 'Caisson lumineux double face pour signalétique extérieure.', 'EN_ATTENTE', NULL, NOW())
ON DUPLICATE KEY UPDATE id=id;

ALTER TABLE devis AUTO_INCREMENT = 4;

-- 4. Insert orders (commandes)
INSERT INTO commandes (id, client_id, type_panneau, dimensions, matiere, prix, statut, devis_id, date_creation) VALUES
(1, 1, 'Néon LED', '120x40 cm', 'Acrylique & Silicone', 4500.00, 'EN_COURS', 1, NOW()),
(2, 3, 'Caisson Lumineux', '150x150 cm', 'Profilé alu, bâche tendue diffusante', 6800.00, 'EN_ATTENTE', 3, NOW())
ON DUPLICATE KEY UPDATE id=id;

ALTER TABLE commandes AUTO_INCREMENT = 3;
