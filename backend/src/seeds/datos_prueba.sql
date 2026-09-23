-- Categorías
INSERT INTO categorias (nombre) VALUES
('Aceites de motor'),
('Aceites de transmisión'),
('Refrigerantes'),
('Líquido de frenos'),
('Aditivos')
ON CONFLICT DO NOTHING;

-- Productos con marca, viscosidad y presentación
INSERT INTO productos (categoria_id, nombre, marca, descripcion, viscosidad, presentacion, unidad_medida, estado) VALUES
((SELECT id FROM categorias WHERE nombre = 'Aceites de motor'), 'Mobil Super', 'Mobil', 'Aceite de motor', '20W-50', '1', 'litro', true),
((SELECT id FROM categorias WHERE nombre = 'Aceites de motor'), 'Mobil Super', 'Mobil', 'Aceite de motor', '20W-50', '4', 'litros', true),
((SELECT id FROM categorias WHERE nombre = 'Aceites de motor'), 'Castrol GTX', 'Castrol', 'Aceite de motor', '10W-40', '1', 'litro', true),
((SELECT id FROM categorias WHERE nombre = 'Aceites de motor'), 'Castrol GTX', 'Castrol', 'Aceite de motor', '10W-40', '4', 'litros', true),
((SELECT id FROM categorias WHERE nombre = 'Aceites de motor'), 'Shell Helix', 'Shell', 'Aceite de motor', '5W-30', '1', 'litro', true),
((SELECT id FROM categorias WHERE nombre = 'Aceites de motor'), 'Shell Helix', 'Shell', 'Aceite de motor', '5W-30', '4', 'litros', true),
((SELECT id FROM categorias WHERE nombre = 'Aceites de motor'), 'Valvoline MaxLife', 'Valvoline', 'Aceite de motor', '15W-40', '1', 'litro', true),
((SELECT id FROM categorias WHERE nombre = 'Aceites de motor'), 'Valvoline MaxLife', 'Valvoline', 'Aceite de motor', '15W-40', '4', 'litros', true),
((SELECT id FROM categorias WHERE nombre = 'Aceites de transmisión'), 'Mobil ATF 320', 'Mobil', 'Aceite de transmisión', 'N/A', '1', 'litro', true),
((SELECT id FROM categorias WHERE nombre = 'Aceites de transmisión'), 'Castrol Transmax', 'Castrol', 'Aceite de transmisión', 'N/A', '1', 'litro', true)
ON CONFLICT DO NOTHING;

-- Crear un usuario base para los vendedores si no existe
INSERT INTO usuarios (nombre, apellido, email, telefono, password_hash, estado) VALUES
('Admin', 'Vendedores', 'vendedores_test@lubbi.com', '75000000', '123456', true)
ON CONFLICT DO NOTHING;

-- Vendedores de prueba
INSERT INTO vendedores (usuario_id, nombre_comercial, descripcion, telefono, direccion, estado) VALUES
((SELECT id FROM usuarios LIMIT 1), 'Lubricentro Don Roberto', 'Venta de lubricantes', '75000001', 'Plan 3000', true),
((SELECT id FROM usuarios LIMIT 1), 'Distribuidora El Motor', 'Lubricantes en general', '75000002', 'Equipetrol', true),
((SELECT id FROM usuarios LIMIT 1), 'Lubricantes Santa Cruz', 'Centro de servicio', '75000003', 'Av. Cristo Redentor', true),
((SELECT id FROM usuarios LIMIT 1), 'AutoLub Express', 'Cambio de aceite', '75000004', 'Villa 1ro de Mayo', true),
((SELECT id FROM usuarios LIMIT 1), 'Centro Lubricantes Norte', 'Aceites y filtros', '75000005', 'Av. Banzer', true)
ON CONFLICT DO NOTHING;

-- Inventario de prueba
-- Asignando 3 a 6 productos a cada vendedor
DO $$
DECLARE
    v_vendedor_id integer;
    v_producto_id integer;
    v_counter integer;
    v_num_productos integer;
    v_precio decimal;
    v_stock integer;
BEGIN
    FOR v_vendedor_id IN (SELECT id FROM vendedores LIMIT 5) LOOP
        v_num_productos := floor(random() * 4 + 3); -- Entre 3 y 6 productos
        
        FOR v_counter IN 1..v_num_productos LOOP
            -- Seleccionar producto aleatorio
            SELECT id INTO v_producto_id FROM productos ORDER BY random() LIMIT 1;
            
            -- Precio entre 45 y 320
            v_precio := floor(random() * (320 - 45 + 1) + 45);
            -- Stock entre 5 y 30
            v_stock := floor(random() * (30 - 5 + 1) + 5);
            
            BEGIN
                INSERT INTO inventario (vendedor_id, producto_id, precio, stock, estado)
                VALUES (v_vendedor_id, v_producto_id, v_precio, v_stock, true);
            EXCEPTION WHEN unique_violation THEN
                -- Do nothing if already exists
            END;
        END LOOP;
    END LOOP;
END $$;
