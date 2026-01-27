-- Crear la tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO tasks (title, description, completed) VALUES
('Configurar Docker Compose', 'Crear archivo docker-compose.yml con los tres servicios', true),
('Desarrollar Backend API', 'Crear API REST con Node.js y Express', false),
('Crear Frontend Angular', 'Desarrollar interfaz de usuario con Angular', false),
('Conectar a MySQL', 'Configurar la conexión a la base de datos', false),
('Probar la aplicación', 'Verificar que todo funciona correctamente', false);