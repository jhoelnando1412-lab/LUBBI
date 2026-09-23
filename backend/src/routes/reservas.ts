import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { 
      usuario_id, 
      vendedor_id, 
      inventario_id, 
      cantidad, 
      precio_unitario, 
      total 
    } = req.body;

    await client.query('BEGIN');

    // 1. Create Pedido
    const numero_pedido = `PED-${Date.now()}`;
    const pedidoResult = await client.query(`
      INSERT INTO pedidos (usuario_id, vendedor_id, numero_pedido, estado, subtotal, total)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [usuario_id, vendedor_id, numero_pedido, 'Pendiente', total, total]);
    
    const pedido_id = pedidoResult.rows[0].id;

    // 2. Create Detalle Pedido
    await client.query(`
      INSERT INTO detalle_pedido (pedido_id, inventario_id, cantidad, precio_unitario, subtotal)
      VALUES ($1, $2, $3, $4, $5)
    `, [pedido_id, inventario_id, cantidad, precio_unitario, total]);

    // 3. Create Reserva
    const codigo_reserva = `RES-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const reservaResult = await client.query(`
      INSERT INTO reservas (pedido_id, codigo_reserva, estado, monto, fecha_reserva)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, codigo_reserva, estado
    `, [pedido_id, codigo_reserva, 'Pendiente de pago', total]);

    // 4. Create Pago (pending)
    await client.query(`
      INSERT INTO pagos (pedido_id, metodo_pago, estado, monto)
      VALUES ($1, $2, $3, $4)
    `, [pedido_id, 'QR', 'Pendiente', total]);

    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Reserva creada con éxito',
      reserva: reservaResult.rows[0],
      numero_pedido
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear reserva:', error);
    res.status(500).json({ mensaje: 'Error al procesar la reserva' });
  } finally {
    client.release();
  }
});

export default router;
