# Volcano Vibes · POS (prototipo)

## Estructura
- `index.html` — **Punto de venta**: catálogo por categorías, carrito lateral, cobro con cálculo de cambio e impresión de factura.
- `gastos.html` — **Gastos**: registro de compras de insumos (precio siempre digitado a mano), con su propio reporte diario/mensual y exportación a PDF/Excel.
- `ventas.html` — **Ventas y reportes**: tarjetas del día/mes, tabla diaria, consolidado mensual por producto, exportar PDF/Excel, cerrar día.
- `store.js` — catálogo de productos, insumos y toda la persistencia (compartido por las tres pantallas).
- `pos.js` / `gastos.js` / `ventas.js` — lógica de cada pantalla.
- `style.css` — estilos de toda la app.

## Cómo probarlo
1. Descomprime el `.zip` y abre `index.html` en el navegador (o arrastra la carpeta a Netlify Drop).
2. Filtra por categoría y toca "+" en los productos para armar la orden.
3. Ajusta cantidades o quita productos directamente en "Orden actual".
4. Presiona **Cobrar e imprimir**: te pide el efectivo recibido, calcula el cambio y, al confirmar, abre el diálogo de impresión del navegador ya con la factura lista (formato tipo tiquete: encabezado del negocio, número de factura consecutivo, detalle, subtotal, IVA 13%, total, efectivo y cambio).
5. Esa venta queda registrada automáticamente — ve a **Ventas y reportes** para verla en "Ventas de hoy" y en el consolidado mensual.
6. **Cierre del día** en reportes cierra el turno: las ventas del día pasan al consolidado mensual y la lista de hoy queda en cero.

## Cómo se resolvió el problema de la ventana en blanco
En vez de abrir una ventana nueva (`window.open`) y escribirle el tiquete después —que es la causa típica del popup en blanco—, la factura vive **oculta dentro de la misma página** (`#printTicket`). Al cobrar, se llenan sus datos en el DOM (ya renderizados) y solo entonces se llama a `window.print()`. Una regla `@media print` oculta todo lo demás y muestra únicamente el tiquete, del ancho de una impresora térmica (78mm). No hay ventana emergente que pueda quedar a medio cargar.

## Cómo funciona el registro de ventas
- Firestore es la fuente de verdad para `vv_day_sales` (ventas del turno activo), `vv_archive` (ventas archivadas), gastos, cierres, turno abierto y secuencia de facturas.
- El documento compartido conserva la ruta existente `volcano_vibes/admin`; las ventas históricas guardan el nombre y precio del producto como parte de cada fila, por lo que quitar un producto del catálogo no borra ventas anteriores.
- `localStorage` conserva una caché del último estado remoto y una cola de operaciones pendientes (`vv_pending_operations`). Un cobro o gasto solo se confirma en pantalla cuando la transacción remota se confirma. Si el resultado de una operación queda incierto, se conserva el carrito y puede reintentarse con el mismo identificador para evitar duplicados.
- El catálogo y los insumos se leen de Firestore. Si los campos `vv_products` o `vv_supplies` no existen en un documento ya creado, la aplicación los agrega de forma aditiva con el catálogo actual; no modifica ventas, gastos, cierres ni turnos existentes.

## Cómo funciona la pantalla de Gastos
- Los gastos usan campos separados (`vv_expense_day` y `vv_expense_archive`) en el estado compartido de Firestore; no se mezclan con los registros de venta.
- Los "insumos frecuentes" son solo atajos con el nombre del producto — nunca traen un precio fijo, porque el precio de cada compra lo escribe siempre la persona encargada.
- El botón "Registrar gasto" no deja guardar una fila sin precio.
- "Cerrar día" funciona igual que en Ventas y reportes: manda los gastos de hoy al consolidado mensual.

## Resumen financiero (ganancia neta)
En "Ventas y reportes" ahora hay un panel **Resumen financiero** que resta los gastos registrados en Gastos a las ventas, mostrando "Ganancia neta" tanto de hoy como del mes en curso (las dos, no solo una — así se ve completo de un vistazo, como en cualquier reporte de caja diario/mensual). El PDF y el Excel que exportas desde ahí ahora también incluyen, arriba de la tabla de detalle, los tres montos: Ventas totales, Gastos totales y Ganancia neta — del período que tengas seleccionado (día o mes).

## Inicio de sesión (usuario y contraseña)
El login solo se pide una vez, al entrar por `index.html` (Punto de venta) — de ahí en adelante puedes moverte a Gastos y a Ventas y reportes sin que te lo vuelvan a pedir.
- Usuario y contraseña por defecto: **admin / admin**. Se cambian en `store.js`, en el objeto `AUTH` (arriba del archivo).
- "Cerrar sesión" está en la barra de navegación de cada pantalla.
- Este inicio de sesión de interfaz no es Firebase Authentication ni sustituye las reglas de Firestore. Las reglas existentes deben autorizar únicamente a las identidades y operaciones previstas por el negocio.

## Sincronización con Firestore

- Antes de habilitar las operaciones, la app solicita una lectura al servidor, comprueba el turno y mantiene una suscripción `onSnapshot`. La pantalla indica conexión, carga, error de lectura/permisos o conflicto.
- Las operaciones compartidas usan transacciones sobre el documento remoto y actualizan únicamente los campos que cambian. No se carga el caché local para sustituir el estado remoto.
- Si encuentra datos locales distintos, conserva una copia en `vv_sync_conflict_backup` y pausa escrituras. Si hay un documento remoto válido, el operador puede elegir explícitamente **Usar Firestore y conservar copia local**. Si Firestore no contiene el documento, la aplicación no importa los datos locales automáticamente; requiere revisar la copia y autorizar un procedimiento de recuperación.
- Las operaciones pendientes no se suben en segundo plano sin intervención. Cuando Firestore vuelve a estar disponible, se pueden reintentar explícitamente desde el indicador de estado; cada operación reutiliza un identificador idempotente.

**Respaldo y recuperación:** antes de cualquier importación o migración de datos financieros, exporta una copia del documento Firestore y de la copia local en conflicto; anota número de filas y totales por período. Recupera primero en una copia del proyecto y compara ventas, gastos, cierres, turno y secuencia de factura antes de habilitar escrituras. El código actual no migra automáticamente historiales locales al documento remoto.

Tras publicar una versión nueva, recarga la aplicación en todos los dispositivos. Los clientes con la versión anterior todavía pueden escribir con el protocolo antiguo y no respetan las transacciones ni la resolución de conflictos de esta versión.

## Siguientes pasos sugeridos
- Reemplazar los datos de `NEGOCIO` en `store.js` (cédula, teléfono) por los reales del negocio.
- Ajustar precios y categorías del catálogo en `store.js` según el menú final.
