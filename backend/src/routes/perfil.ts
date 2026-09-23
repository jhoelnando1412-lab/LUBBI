import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET /api/perfil/:usuario_id
router.get('/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.estado, u.created_at,
              r.nombre as rol
       FROM usuarios u
       JOIN usuario_roles ur ON u.id = ur.usuario_id
       JOIN roles r ON ur.rol_id = r.id
       WHERE u.id = $1`,
      [usuario_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener perfil' });
  }
});

// PUT /api/perfil/:usuario_id
router.put('/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { nombre, apellido, telefono } = req.body;
    const result = await pool.query(
      `UPDATE usuarios SET nombre=$1, apellido=$2, telefono=$3, updated_at=NOW()
       WHERE id=$4 RETURNING id, nombre, apellido, email, telefono`,
      [nombre, apellido, telefono, usuario_id]
    );
    res.json({ mensaje: 'Perfil actualizado', usuario: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al actualizar perfil' });
  }
});

// GET /api/perfil/:usuario_id/pedidos
router.get('/:usuario_id/pedidos', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query(
      `SELECT p.id, p.numero_pedido, p.estado, p.total, p.created_at,
              v.nombre_comercial as vendedor,
              json_agg(json_build_object(
                'nombre', prod.nombre,
                'marca', prod.marca,
                'cantidad', dp.cantidad,
                'precio_unitario', dp.precio_unitario,
                'subtotal', dp.subtotal
              )) as productos
       FROM pedidos p
       JOIN vendedores v ON p.vendedor_id = v.id
       JOIN detalle_pedido dp ON p.id = dp.pedido_id
       JOIN inventario i ON dp.inventario_id = i.id
       JOIN productos prod ON i.producto_id = prod.id
       WHERE p.usuario_id = $1
       GROUP BY p.id, v.nombre_comercial
       ORDER BY p.created_at DESC`,
      [usuario_id]
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }
});

// GET /api/perfil/:usuario_id/reservas
router.get('/:usuario_id/reservas', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query(
      `SELECT r.id, r.codigo_reserva, r.estado, r.monto, r.fecha_reserva, r.fecha_expiracion,
              p.numero_pedido, v.nombre_comercial as vendedor,
              json_agg(json_build_object(
                'nombre', prod.nombre,
                'marca', prod.marca,
                'cantidad', dp.cantidad
              )) as productos
       FROM reservas r
       JOIN pedidos p ON r.pedido_id = p.id
       JOIN vendedores v ON p.vendedor_id = v.id
       JOIN detalle_pedido dp ON p.id = dp.pedido_id
       JOIN inventario i ON dp.inventario_id = i.id
       JOIN productos prod ON i.producto_id = prod.id
       WHERE p.usuario_id = $1
       GROUP BY r.id, p.numero_pedido, v.nombre_comercial
       ORDER BY r.created_at DESC`,
      [usuario_id]
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener reservas' });
  }
});

// GET /api/perfil/:usuario_id/favoritos
router.get('/:usuario_id/favoritos', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query(
      `SELECT f.id, f.producto_id, f.vendedor_id,
              prod.nombre as producto_nombre, prod.marca,
              v.nombre_comercial
       FROM favoritos f
       LEFT JOIN productos prod ON f.producto_id = prod.id
       LEFT JOIN vendedores v ON f.vendedor_id = v.id
       WHERE f.usuario_id = $1
       ORDER BY f.created_at DESC`,
      [usuario_id]
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener favoritos' });
  }
});

// GET /api/perfil/:usuario_id/notificaciones
router.get('/:usuario_id/notificaciones', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query(
      `SELECT id, tipo, titulo, mensaje, leida, created_at
       FROM notificaciones
       WHERE usuario_id = $1
       ORDER BY created_at DESC`,
      [usuario_id]
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener notificaciones' });
  }
});

// PUT /api/perfil/notificaciones/:id/leida
router.put('/notificaciones/:id/leida', async (req, res) => {
  try {
    await pool.query(`UPDATE notificaciones SET leida=true WHERE id=$1`, [req.params.id]);
    res.json({ mensaje: 'Notificación marcada como leída' });
  } catch (e) {
    res.status(500).json({ mensaje: 'Error' });
  }
});

// GET /api/perfil/:usuario_id/conversaciones
router.get('/:usuario_id/conversaciones', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query(
      `SELECT cc.id, cc.estado, cc.created_at,
              r.codigo_reserva,
              v.nombre_comercial as vendedor,
              u_v.nombre as nombre_vendedor,
              (SELECT cm.mensaje FROM chat_mensajes cm WHERE cm.conversacion_id = cc.id ORDER BY cm.created_at DESC LIMIT 1) as ultimo_mensaje,
              (SELECT cm.created_at FROM chat_mensajes cm WHERE cm.conversacion_id = cc.id ORDER BY cm.created_at DESC LIMIT 1) as ultimo_mensaje_fecha
       FROM chat_conversaciones cc
       JOIN reservas r ON cc.reserva_id = r.id
       JOIN vendedores v ON cc.vendedor_id = v.id
       JOIN usuarios u_v ON v.usuario_id = u_v.id
       WHERE cc.comprador_id = $1
       ORDER BY cc.created_at DESC`,
      [usuario_id]
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener conversaciones' });
  }
});

// GET /api/perfil/conversaciones/:id/mensajes
router.get('/conversaciones/:id/mensajes', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cm.id, cm.mensaje, cm.leido, cm.created_at,
              u.nombre as remitente
       FROM chat_mensajes cm
       JOIN usuarios u ON cm.remitente_usuario_id = u.id
       WHERE cm.conversacion_id = $1
       ORDER BY cm.created_at ASC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ mensaje: 'Error al obtener mensajes' });
  }
});

// POST /api/perfil/conversaciones/:id/mensajes
router.post('/conversaciones/:id/mensajes', async (req, res) => {
  try {
    const { remitente_usuario_id, mensaje } = req.body;
    const result = await pool.query(
      `INSERT INTO chat_mensajes (conversacion_id, remitente_usuario_id, mensaje)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.params.id, remitente_usuario_id, mensaje]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ mensaje: 'Error al enviar mensaje' });
  }
});

export default router;
