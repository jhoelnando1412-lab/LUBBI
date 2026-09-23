import fs from 'fs';
import path from 'path';
import { pool } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

async function runSeed() {
  try {
    const sqlPath = path.join(__dirname, 'seeds', 'datos_prueba.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Ejecutando script SQL...');
    await pool.query(sql);
    console.log('Script ejecutado exitosamente.');
  } catch (error) {
    console.error('Error al ejecutar el script:', error);
  } finally {
    await pool.end();
  }
}

runSeed();
