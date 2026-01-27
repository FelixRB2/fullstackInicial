// Importar dotenv para cargar variables de entorno
import dotenv from 'dotenv';
dotenv.config();

// Importar chalk para mensajes coloridos (como en la guía)
import chalk from 'chalk';

// Importar la aplicación Express
import app from './src/app.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Iniciar el servidor
app.listen(PORT, HOST, () => {
  console.log(chalk.green('================================='));
  console.log(chalk.blue.bold('🚀 Servidor Backend Iniciado'));
  console.log(chalk.green('================================='));
  console.log(chalk.yellow(`📍 URL: http://${HOST}:${PORT}`));
  console.log(chalk.yellow(`📋 Entorno: ${process.env.NODE_ENV}`));
  console.log(chalk.yellow(`🗄️  Base de datos: ${process.env.DB_NAME}@${process.env.DB_HOST}`));
  console.log(chalk.cyan(`📚 API Docs: http://${HOST}:${PORT}/`));
  console.log(chalk.green('================================='));
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error(chalk.red.bold('❌ Error no capturado:'), error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red.bold('❌ Promesa rechazada no manejada:'), reason);
  process.exit(1);
});