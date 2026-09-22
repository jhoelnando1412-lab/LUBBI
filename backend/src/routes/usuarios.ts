import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// Registrar un usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, password_hash } = req.body;

    if (!nombre || !apellido || !email) {
      return res.status(400).json({
        mensaje: 'Nombre, apellido y email son obligatorios'
      });
    }

    const resultado = await pool.query(
      `INSERT INTO usuarios
       (nombre, apellido, email, telefono, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, apellido, email, telefono, estado, created_at`,
      [nombre, apellido, email, telefono, password_hash || null]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: resultado.rows[0]
    });

  } catch (error: any) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(409).json({
        mensaje: 'El email ya está registrado'
      });
    }

    res.status(500).json({
      mensaje: 'Error al registrar el usuario'
    });
  }
});

export default router;