import db from '../config/database.js';

/**
 * Modelo de datos para las tareas
 * Contiene todos los métodos para interactuar con la tabla 'tasks'
 */
class TaskModel {
  /**
   * Obtener todas las tareas ordenadas por fecha de creación
   * @returns {Promise<Array>} Array de tareas
   */
  static async getAll() {
    const sql = 'SELECT * FROM tasks ORDER BY created_at DESC';
    return await db.query(sql);
  }

  /**
   * Obtener una tarea específica por su ID
   * @param {number} id - ID de la tarea
   * @returns {Promise<Object|null>} Tarea encontrada o null
   */
  static async getById(id) {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    const results = await db.query(sql, [id]);
    return results[0] || null;
  }

  /**
   * Crear una nueva tarea
   * @param {Object} taskData - Datos de la tarea (title, description)
   * @returns {Promise<number>} ID de la tarea creada
   */
  static async create(taskData) {
    const { title, description = '' } = taskData;
    const sql = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
    const result = await db.query(sql, [title, description]);
    return result.insertId;
  }

  /**
   * Actualizar una tarea existente
   * @param {number} id - ID de la tarea
   * @param {Object} taskData - Datos a actualizar
   * @returns {Promise<boolean>} true si se actualizó, false si no
   */
  static async update(id, taskData) {
    const { title, description, completed } = taskData;
    const sql = 'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?';
    const result = await db.query(sql, [title, description, completed ? 1 : 0, id]);
    return result.affectedRows > 0;
  }

  /**
   * Alternar el estado de completado de una tarea
   * @param {number} id - ID de la tarea
   * @returns {Promise<boolean>} true si se actualizó, false si no
   */
  static async toggleCompleted(id) {
    const sql = 'UPDATE tasks SET completed = NOT completed WHERE id = ?';
    const result = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Eliminar una tarea
   * @param {number} id - ID de la tarea
   * @returns {Promise<boolean>} true si se eliminó, false si no
   */
  static async delete(id) {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    const result = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Obtener estadísticas de las tareas
   * @returns {Promise<Object>} Objeto con estadísticas (total, completed, pending)
   */
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(completed) as completed,
        COUNT(*) - SUM(completed) as pending
      FROM tasks
    `;
    const results = await db.query(sql);
    return results[0];
  }
}

export default TaskModel;