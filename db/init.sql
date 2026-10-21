CREATE DATABASE IF NOT EXISTS pendientes
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pendientes;

CREATE TABLE IF NOT EXISTS categorias (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tareas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  completada TINYINT(1) NOT NULL DEFAULT 0,
  categoria_id INT UNSIGNED NULL,
  creada_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tareas_completada (completada),
  INDEX idx_tareas_categoria (categoria_id),
  CONSTRAINT fk_tareas_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias(id) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO categorias (nombre) VALUES ('Personal'), ('Escuela'), ('Trabajo');
INSERT INTO tareas (titulo, categoria_id) VALUES
  ('Entregar reto DAWyM U2 R3', 2),
  ('Probar la app en dos navegadores', 2);
  