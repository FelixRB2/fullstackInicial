import mysql from 'mysql2/promise';
import chalk from 'chalk';

// Configuración del pool de conexiones
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'appdb',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0
};

let pool;

/**
 * Inicializa la conexión a la base de datos con reintentos automáticos
 * @param {number} retries - Número de reintentos
 * @param {number} delay - Tiempo de espera entre reintentos (ms)
 */
async function initDatabase(retries = 10, delay = 5000) {
  try {
    // Crear el pool de conexiones
    pool = mysql.createPool(dbConfig);
    
    // Probar la conexión obteniendo una conexión del pool
    const connection = await pool.getConnection();
    
    console.log(chalk.green.bold('✅ Conexión a MySQL establecida correctamente'));
    console.log(chalk.cyan(`   📊 Base de datos: ${dbConfig.database}`));
    console.log(chalk.cyan(`   🖥️  Host: ${dbConfig.host}:${dbConfig.port}`));
    console.log(chalk.cyan(`   👤 Usuario: ${dbConfig.user}`));
    
    // Liberar la conexión de vuelta al pool
    connection.release();
    
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Error al conectar con MySQL:'), error.message);
    
    if (retries > 0) {
      console.log(chalk.yellow(`⏳ Reintentando en ${delay / 1000} segundos...`));
      console.log(chalk.yellow(`   Intentos restantes: ${retries}`));
      
      // Esperar antes de reintentar
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Reintentar recursivamente
      return initDatabase(retries - 1, delay);
    } else {
      console.error(chalk.red.bold('💥 No se pudo establecer conexión con la base de datos después de múltiples intentos'));
      throw error;
    }
  }
}

/**
 * Obtiene el pool de conexiones
 * @throws {Error} Si el pool no está inicializado
 */
function getPool() {
  if (!pool) {
    throw new Error('Database pool no inicializado. Llama a initDatabase() primero.');
  }
  return pool;
}

/**
 * Ejecuta una consulta SQL
 * @param {string} sql - Consulta SQL
 * @param {Array} params - Parámetros de la consulta
 * @returns {Promise} Resultado de la consulta
 */
async function query(sql, params = []) {
  const currentPool = getPool();
  try {
    const [results] = await currentPool.execute(sql, params);
    return results;
  } catch (error) {
    console.error(chalk.red('❌ Error en consulta SQL:'), error.message);
    console.error(chalk.gray('   SQL:'), sql);
    console.error(chalk.gray('   Params:'), params);
    throw error;
  }
}

/**
 * Cierra todas las conexiones del pool
 */
async function closePool() {
  if (pool) {
    await pool.end();
    console.log(chalk.yellow('🔌 Conexiones a la base de datos cerradas'));
  }
}

export default {
  initDatabase,
  getPool,
  query,
  closePool
};