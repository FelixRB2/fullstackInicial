import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import taskRoutes from './routes/taskRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import db from './config/database.js';

const app = express();

// =================================
// Middlewares globales
// =================================

// Habilitar CORS para permitir peticiones desde el frontend
app.use(cors());

// Parsear JSON en el body de las peticiones
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log de peticiones HTTP
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(chalk.gray(`[${timestamp}]`), chalk.cyan(`${req.method}`), chalk.white(req.path));
  next();
});

// =================================
// Inicializar base de datos
// =================================

db.initDatabase().catch(error => {
  console.error(chalk.red.bold('❌ Error fatal al conectar con la base de datos'), error);
  process.exit(1);
});

// =================================
// Rutas
// =================================

// Ruta de salud (health check)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: 'Connected'
  });
});

// Ruta raíz con documentación de la API
app.get('/', (req, res) => {
  res.json({
    message: '🎯 API de Gestión de Tareas',
    version: '1.0.0',
    description: 'API REST para gestionar tareas con persistencia en MySQL',
    tecnologias: ['Node.js', 'Express', 'MySQL', 'Docker'],
    endpoints: {
      tasks: {
        getAll: 'GET /api/tasks',
        getById: 'GET /api/tasks/:id',
        create: 'POST /api/tasks',
        update: 'PUT /api/tasks/:id',
        toggle: 'PATCH /api/tasks/:id/toggle',
        delete: 'DELETE /api/tasks/:id',
        stats: 'GET /api/tasks/stats'
      },
      health: 'GET /health'
    }
  });
});

// Rutas de la API de tareas
app.use('/api/tasks', taskRoutes);

// =================================
// Manejo de errores
// =================================

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Manejo de rutas no encontradas (404)
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method,
    message: 'La ruta solicitada no existe en esta API'
  });
});

export default app;