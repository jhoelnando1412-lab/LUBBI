import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { pool } from './config/database';
import usuariosRoutes from './routes/usuarios';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/usuarios', usuariosRoutes);
app.get('/api/usuarios', (req, res) => {
  res.json({
    mensaje: 'Ruta de usuarios funcionando correctamente'
  });
});

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de LUBBI funcionando correctamente'
  });
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS fecha');

    res.json({
      conectado: true,
      mensaje: 'Conexión con PostgreSQL exitosa',
      fecha: result.rows[0].fecha
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      conectado: false,
      mensaje: 'Error al conectar con PostgreSQL'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor LUBBI ejecutándose en http://localhost:${PORT}`);
});