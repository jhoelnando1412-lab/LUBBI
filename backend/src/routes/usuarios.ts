import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// Registrar un usuario
router.post('/', async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      nombre,
      apellido,
      email,
      telefono,
      password,
      tipo_cuenta,
      nombre_comercial,
      descripcion,
      telefono_negocio,
      direccion
    } = req.body;

    if (!nombre || !apellido || !email || !password || !tipo_cuenta) {
      return res.status(400).json({
        mensaje: 'Faltan campos obligatorios'
      });
    }

    if (tipo_cuenta !== 'comprador' && tipo_cuenta !== 'vendedor') {
      return res.status(400).json({
        mensaje: 'Tipo de cuenta inválido'
      });
    }

    if (tipo_cuenta === 'vendedor') {
      if (!nombre_comercial || !telefono_negocio || !direccion) {
        return res.status(400).json({
          mensaje: 'Faltan campos obligatorios para el negocio'
        });
      }
    }

    await client.query('BEGIN');

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Buscar el rol
    const rolResult = await client.query(
      `SELECT id FROM roles WHERE nombre = $1`,
      [tipo_cuenta]
    );

    if (rolResult.rows.length === 0) {
      throw new Error(`Rol ${tipo_cuenta} no encontrado en la base de datos`);
    }

    const rol_id = rolResult.rows[0].id;

    // Crear el usuario
    const resultado = await client.query(
      `INSERT INTO usuarios
       (nombre, apellido, email, telefono, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, apellido, email, telefono, estado, created_at`,
      [nombre, apellido, email, telefono, password_hash]
    );

    const nuevoUsuario = resultado.rows[0];
    const usuario_id = nuevoUsuario.id;

    // Asignar el rol en usuario_roles
    await client.query(
      `INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2)`,
      [usuario_id, rol_id]
    );

    // Si es vendedor, registrar en vendedores
    if (tipo_cuenta === 'vendedor') {
      await client.query(
        `INSERT INTO vendedores 
         (usuario_id, nombre_comercial, descripcion, telefono, direccion) 
         VALUES ($1, $2, $3, $4, $5)`,
        [usuario_id, nombre_comercial, descripcion || null, telefono_negocio, direccion]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        ...nuevoUsuario,
        rol: tipo_cuenta
      }
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(error);

    if (error.code === '23505') {
      return res.status(409).json({
        mensaje: 'El email ya está registrado'
      });
    }

    res.status(500).json({
      mensaje: 'Error al registrar el usuario'
    });
  } finally {
    client.release();
  }
});

export default router;
// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: 'Email y contraseña son obligatorios'
      });
    }

    // Buscar usuario por email
    const resultado = await pool.query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.password_hash, u.estado,
              r.nombre as rol
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

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas'
      });
    }

    if (!usuario.estado) {
      return res.status(403).json({
        mensaje: 'Usuario inactivo'
      });
    }

    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al iniciar sesión'
    });
  }
});