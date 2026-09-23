import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET /api/tiendas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.id, 
        v.nombre_comercial, 
        v.descripcion, 
        v.telefono, 
        v.direccion,
        COUNT(i.producto_id) as cantidad_productos,
        COALESCE(MIN(i.precio), 0) as precio_minimo
      FROM vendedores v
      LEFT JOIN inventario i ON v.id = i.vendedor_id AND i.estado = true
      WHERE v.estado = true
      GROUP BY v.id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tiendas:', error);
    res.status(500).json({ mensaje: 'Error al obtener tiendas' });
  }
});

// GET /api/tiendas/:id/productos
router.get('/:id/productos', async (req, res) => {
  try {
    const vendedorId = req.params.id;

    const result = await pool.query(`
      SELECT 
        p.nombre, 
        p.marca, 
        p.viscosidad, 
        p.presentacion,
        i.precio, 
        i.stock,
        c.nombre as categoria
      FROM inventario i
      JOIN productos p ON i.producto_id = p.id
      JOIN categorias c ON p.categoria_id = c.id
      WHERE i.vendedor_id = $1 AND i.estado = true AND p.estado = true
    `, [vendedorId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos de la tienda:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos de la tienda' });
  }
});

export default router;
