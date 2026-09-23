import { Router } from 'express';
import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: 'Email y contraseña son obligatorios'
      });
    }

    const resultado = await pool.query(
      `SELECT u.*, r.nombre as rol 
       FROM usuarios u
       JOIN usuario_roles ur ON u.id = ur.usuario_id
       JOIN roles r ON ur.rol_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas'
      });
    }

    const usuario = resultado.rows[0];

    if (!usuario.estado) {
      return res.status(401).json({
        mensaje: 'La cuenta está desactivada'
      });
    }

    const isMatch = await bcrypt.compare(password, usuario.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas'
      });
    }

    res.json({
      mensaje: 'Inicio de sesión correcto',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error en el servidor durante el login'
    });
  }
});

export default router;
