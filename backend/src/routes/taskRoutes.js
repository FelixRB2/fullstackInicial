import express from 'express';
import TaskController from '../controllers/taskController.js';

const router = express.Router();

/**
 * Definición de rutas para la API de tareas
 * Todas estas rutas tienen el prefijo /api/tasks
 */

// Ruta de estadísticas (debe ir ANTES de /:id para evitar conflictos)
router.get('/stats', TaskController.getStats);

// CRUD básico de tareas
router.get('/', TaskController.getAllTasks);           // Obtener todas las tareas
router.get('/:id', TaskController.getTaskById);        // Obtener una tarea por ID
router.post('/', TaskController.createTask);           // Crear nueva tarea
router.put('/:id', TaskController.updateTask);         // Actualizar tarea completa
router.patch('/:id/toggle', TaskController.toggleTask); // Alternar estado completado
router.delete('/:id', TaskController.deleteTask);      // Eliminar tarea

export default router;
