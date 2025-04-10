-- MySQL initialization script for UFRA Notes

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ufranotes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE ufranotes;

-- Create a dedicated user for the application (optional but recommended for production)
-- Replace 'your_password' with a secure password
CREATE USER IF NOT EXISTS 'ufra_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ufranotes.* TO 'ufra_user'@'localhost';
FLUSH PRIVILEGES;

-- Sample data for activities
-- This will be inserted after migrations are applied
-- You can run this part manually after migrations

/*
-- Sample activities
INSERT INTO activities_activity (name, description, activity_type, icon) VALUES 
('Leitura', 'Leitura de livros e artigos acadêmicos', 'intelligence', '📚'),
('Exercício Físico', 'Atividades físicas e esportes', 'health', '🏃'),
('Laboratório', 'Experimentos e práticas de laboratório', 'intelligence', '🧪'),
('Projeto', 'Trabalhos em grupo e projetos', 'strength', '🛠️'),
('Apresentação', 'Apresentações de seminários', 'agility', '🎭'),
('Trabalho de Campo', 'Atividades externas e trabalho de campo', 'strength', '🌱'),
('Estudo', 'Tempo de estudo focado', 'intelligence', '📝'),
('Meditação', 'Práticas de meditação e concentração', 'health', '🧘');

-- Instructions for setting up admin user via Django shell
-- python manage.py shell
-- from django.contrib.auth import get_user_model
-- User = get_user_model()
-- User.objects.create_superuser('admin@example.com', 'admin', 'securepassword')
*/ 