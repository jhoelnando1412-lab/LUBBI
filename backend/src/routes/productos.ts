import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// Obtener todos los productos con tienda
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT 
        i.id,
        p.nombre,
        p.marca,
        p.descripcion,
        c.nombre as categoria,
        i.precio,
        i.stock,
        v.id as vendedor_id,
        v.nombre_comercial,
        v.direccion,
        v.telefono
      FROM inventario i
      JOIN productos p ON i.producto_id = p.id
      JOIN vendedores v ON i.vendedor_id = v.id
      JOIN categorias c ON p.categoria_id = c.id
      WHERE i.estado = true AND i.stock > 0
      ORDER BY p.marca, p.nombre
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
});

export default router;