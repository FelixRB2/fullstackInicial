import chalk from 'chalk';

/**
 * Middleware global de manejo de errores
 * Captura todos los errores que ocurran en la aplicación
 * y devuelve una respuesta JSON apropiada
 */
function errorHandler(err, req, res, next) {
  // Log del error en consola
  console.error(chalk.red.bold('❌ ERROR:'), err.message);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(chalk.gray(err.stack));
  }

  // Errores de base de datos MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Ya existe un registro con esos datos',
      code: err.code,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      error: 'Referencia inválida en la base de datos',
      code: err.code,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  if (err.code === 'ER_BAD_FIELD_ERROR') {
    return res.status(400).json({
      error: 'Campo inválido en la consulta',
      code: err.code,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.message
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'JSON inválido en el cuerpo de la petición',
      details: 'Verifica que el JSON esté correctamente formateado'
    });
  }

  // Error de conexión a base de datos
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'No se pudo conectar a la base de datos',
      code: err.code,
      message: 'El servicio de base de datos no está disponible'
    });
  }

  // Error genérico del servidor
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    code: err.code,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err
    })
  });
}

export default errorHandler;