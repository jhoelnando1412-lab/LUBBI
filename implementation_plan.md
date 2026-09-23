# Reservas - Implementación completa

## Objetivo
Garantizar que el flujo **Producto → Reservar → Pantalla de Reserva → Confirmar Reserva** funcione de forma completa, atómica y con toda la información requerida.

## Cambios requeridos

### Frontend
1. **Lista de productos** (`tienda` o `cliente-home`):
   - Asegurar que al pulsar **"RESERVAR"** se navegue a `/reserva` con **todos** los parámetros necesarios:
     - `producto_id`, `nombre`, `marca`, `presentacion`, `viscosidad?`, `precio`, `vendedor_id`, `nombre_comercial`, `direccion`.
   - Si falta algún campo, añadirlo al objeto enviado al `router.push`.
2. **Pantalla `reserva.tsx`**:
   - Mostrar los datos faltantes (presentación, viscosidad) y la **cantidad**.
   - Mostrar método de pago del vendedor (consulta a `/api/metodos_pago_vendedor/:vendedor_id`).
   - Usar el QR estático `assets/images/qr.jpeg` (ya existente).
   - Añadir botón **"CONFIRMAR RESERVA"** que llama al endpoint `/api/reservas` (POST) y maneja errores.
   - Después de respuesta exitosa, navegar a **`reserva-confirmacion`** pasando los datos devueltos.
3. **Nueva pantalla `reserva-confirmacion.tsx`**:
   - Mostrar mensaje de éxito, código de reserva, producto, vendedor, total, estado.
   - Botones **"Ver mi reserva"** (`/mis-reservas`) y **"Volver al inicio"** (`/cliente-home`).
   - Manejar casos de error mostrando alerta.
4. **Actualización de rutas en `_layout.tsx`** para registrar la nueva pantalla.

### Backend
1. **Mejorar `/api/reservas`** (`backend/src/routes/reservas.ts`):
   - Validar autenticación (usuario_id provisto).
   - Verificar existencia del `inventario` y que `stock >= cantidad`.
   - Obtener `vendedor_id` y datos del método de pago (`metodos_pago_vendedor`).
   - Ejecutar **transacción** que:
     a) Crea `pedido`.
     b) Crea `detalle_pedido`.
     c) Registra `pago` con método obtenido.
     d) Crea `reserva`.
     e) Actualiza `inventario.stock = stock - cantidad`.
   - Si cualquier paso falla, **ROLLBACK**.
   - Responder con objeto JSON que incluya:
     ```json
     { mensaje: "Reserva creada", reserva: { id, codigo_reserva, estado, fecha_reserva }, pedido_id, producto: { id, nombre, marca, presentacion, viscosidad, precio }, vendedor: { id, nombre_comercial }, monto: total }
     ```
2. **Nuevo endpoint GET `/api/metodos_pago_vendedor/:vendedor_id`** para obtener método de pago (ej. QR).
3. Añadir manejo de errores claros (stock insuficiente, vendedor no encontrado, etc.) con códigos HTTP apropiados.

### Base de datos
- No se crearán nuevas tablas; se reutilizan `pedidos`, `detalle_pedido`, `pagos`, `reservas`, `metodos_pago_vendedor` e `inventario`.
- Se asegura que la columna `stock` exista en `inventario` y sea actualizada dentro de la transacción.

## Verificación
- **Pruebas manuales**:
  1. Navegar a la lista de productos, pulsar **RESERVAR** y confirmar que la pantalla muestra todos los datos.
  2. Cambiar cantidad, confirmar reserva y observar que la respuesta muestra el código y los datos correctos.
  3. Verificar en PostgreSQL (`SELECT * FROM reservas WHERE codigo_reserva = ...`) que la reserva y los registros relacionados existen.
  4. Simular error de stock (cantidad mayor al disponible) y comprobar mensaje de error.
- **Automatizado** (opcional): ejecutar `npm test` si existen pruebas unitarias.

## Impacto
- No se modifica la arquitectura existente.
- Solo se añaden/actualizan rutas y pantallas.
- Se mantiene la paleta de colores y estilo existente.

## Preguntas abiertas (requieren confirmación del USUARIO)
- ¿Qué método de pago debe mostrarse? Asumimos que el vendedor tiene un único método registrado (QR). Si existen varios, ¿cuál elegir?
- ¿Desea que el QR se obtenga dinámicamente según el vendedor o siempre el mismo `qr.jpeg`?
- ¿Qué nombre se debe usar para la ruta de confirmación? Actualmente `reserva-confirmacion` ya existe, ¿es aceptable?

---

**Por favor, revise el plan y confirme para proceder con la implementación.**
