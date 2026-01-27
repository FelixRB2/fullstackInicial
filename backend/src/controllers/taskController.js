import TaskModel from '../models/taskModel.js';
import chalk from 'chalk';

/**
 * Controlador para manejar las operaciones CRUD de tareas
 * Cada método maneja una ruta específica de la API
 */
class TaskController {
  /**
   * GET /api/tasks
   * Obtener todas las tareas
   */
  static async getAllTasks(req, res, next) {
    try {
      console.log(chalk.blue('📋 Obteniendo todas las tareas...'));
      const tasks = await TaskModel.getAll();
      console.log(chalk.green(`✅ Se obtuvieron ${tasks.length} tareas`));
      res.json(tasks);
    } catch (error) {
      console.error(chalk.red('❌ Error al obtener tareas:'), error.message);
      next(error);
    }
  }

  /**
   * GET /api/tasks/:id
   * Obtener una tarea específica por ID
   */
  static async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      console.log(chalk.blue(`🔍 Buscando tarea con ID: ${id}`));
      
      const task = await TaskModel.getById(id);
      
      if (!task) {
        console.log(chalk.yellow(`⚠️  Tarea con ID ${id} no encontrada`));
        return res.status(404).json({ 
          error: 'Tarea no encontrada',
          id: parseInt(id)
        });
      }
      
      console.log(chalk.green(`✅ Tarea encontrada: "${task.title}"`));
      res.json(task);
    } catch (error) {
      console.error(chalk.red('❌ Error al obtener tarea:'), error.message);
      next(error);
    }
  }

  /**
   * POST /api/tasks
   * Crear una nueva tarea
   */
  static async createTask(req, res, next) {
    try {
      const { title, description } = req.body;
      
      // Validación
      if (!title || title.trim() === '') {
        console.log(chalk.yellow('⚠️  Intento de crear tarea sin título'));
        return res.status(400).json({ 
          error: 'El título es obligatorio' 
        });
      }

      console.log(chalk.blue(`➕ Creando nueva tarea: "${title}"`));
      
      // Crear tarea
      const taskId = await TaskModel.create({ title, description });
      const newTask = await TaskModel.getById(taskId);
      
      console.log(chalk.green(`✅ Tarea creada exitosamente con ID: ${taskId}`));
      
      res.status(201).json({
        message: 'Tarea creada correctamente',
        task: newTask
      });
    } catch (error) {
      console.error(chalk.red('❌ Error al crear tarea:'), error.message);
      next(error);
    }
  }

  /**
   * PUT /api/tasks/:id
   * Actualizar una tarea completa
   */
  static async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;
      
      // Validación
      if (!title || title.trim() === '') {
        return res.status(400).json({ 
          error: 'El título es obligatorio' 
        });
      }

      console.log(chalk.blue(`📝 Actualizando tarea con ID: ${id}`));
      
      // Verificar que la tarea existe
      const task = await TaskModel.getById(id);
      if (!task) {
        console.log(chalk.yellow(`⚠️  Tarea con ID ${id} no encontrada`));
        return res.status(404).json({ 
          error: 'Tarea no encontrada',
          id: parseInt(id)
        });
      }

      // Actualizar tarea
      await TaskModel.update(id, { title, description, completed });
      const updatedTask = await TaskModel.getById(id);
      
      console.log(chalk.green(`✅ Tarea actualizada: "${updatedTask.title}"`));
      
      res.json({
        message: 'Tarea actualizada correctamente',
        task: updatedTask
      });
    } catch (error) {
      console.error(chalk.red('❌ Error al actualizar tarea:'), error.message);
      next(error);
    }
  }

  /**
   * PATCH /api/tasks/:id/toggle
   * Alternar estado de completado
   */
  static async toggleTask(req, res, next) {
    try {
      const { id } = req.params;
      
      console.log(chalk.blue(`🔄 Alternando estado de tarea con ID: ${id}`));
      
      // Verificar que la tarea existe
      const task = await TaskModel.getById(id);
      if (!task) {
        console.log(chalk.yellow(`⚠️  Tarea con ID ${id} no encontrada`));
        return res.status(404).json({ 
          error: 'Tarea no encontrada',
          id: parseInt(id)
        });
      }

      // Alternar estado
      await TaskModel.toggleCompleted(id);
      const updatedTask = await TaskModel.getById(id);
      
      const estado = updatedTask.completed ? 'completada' : 'pendiente';
      console.log(chalk.green(`✅ Tarea marcada como ${estado}`));
      
      res.json({
        message: `Tarea marcada como ${estado}`,
        task: updatedTask
      });
    } catch (error) {
      console.error(chalk.red('❌ Error al alternar tarea:'), error.message);
      next(error);
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Eliminar una tarea
   */
  static async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      
      console.log(chalk.blue(`🗑️  Eliminando tarea con ID: ${id}`));
      
      // Verificar que la tarea existe
      const task = await TaskModel.getById(id);
      if (!task) {
        console.log(chalk.yellow(`⚠️  Tarea con ID ${id} no encontrada`));
        return res.status(404).json({ 
          error: 'Tarea no encontrada',
          id: parseInt(id)
        });
      }

      // Eliminar tarea
      await TaskModel.delete(id);
      
      console.log(chalk.green(`✅ Tarea "${task.title}" eliminada correctamente`));
      
      res.json({
        message: 'Tarea eliminada correctamente',
        id: parseInt(id)
      });
    } catch (error) {
      console.error(chalk.red('❌ Error al eliminar tarea:'), error.message);
      next(error);
    }
  }

  /**
   * GET /api/tasks/stats
   * Obtener estadísticas de tareas
   */
  static async getStats(req, res, next) {
    try {
      console.log(chalk.blue('📊 Obteniendo estadísticas...'));
      const stats = await TaskModel.getStats();
      console.log(chalk.green('✅ Estadísticas obtenidas'));
      res.json(stats);
    } catch (error) {
      console.error(chalk.red('❌ Error al obtener estadísticas:'), error.message);
      next(error);
    }
  }
}

export default TaskController;