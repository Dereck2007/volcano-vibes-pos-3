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
6. **Reiniciar día** en reportes cierra el turno: las ventas del día pasan al consolidado mensual y la lista de hoy queda en cero.

## Cómo se resolvió el problema de la ventana en blanco
En vez de abrir una ventana nueva (`window.open`) y escribirle el tiquete después —que es la causa típica del popup en blanco—, la factura vive **oculta dentro de la misma página** (`#printTicket`). Al cobrar, se llenan sus datos en el DOM (ya renderizados) y solo entonces se llama a `window.print()`. Una regla `@media print` oculta todo lo demás y muestra únicamente el tiquete, del ancho de una impresora térmica (78mm). No hay ventana emergente que pueda quedar a medio cargar.

## Cómo funciona el registro de ventas
- Todo vive en `localStorage` del navegador: `vv_day_sales` (ventas del día activo) y `vv_archive` (días ya cerrados, usados para el consolidado mensual). No hay backend ni ERP conectado todavía.
- La numeración de factura (`FS/2026/0001`, etc.) es consecutiva por año y se guarda también en `localStorage`.

## Cómo funciona la pantalla de Gastos
- Es independiente de las ventas: usa sus propias llaves en `localStorage` (`vv_expense_day` y `vv_expense_archive`), así que no se mezcla con los datos de venta.
- Los "insumos frecuentes" son solo atajos con el nombre del producto — nunca traen un precio fijo, porque el precio de cada compra lo escribe siempre la persona encargada.
- El botón "Registrar gasto" no deja guardar una fila sin precio.
- "Cerrar día" funciona igual que en Ventas y reportes: manda los gastos de hoy al consolidado mensual.

## Resumen financiero (ganancia neta)
En "Ventas y reportes" ahora hay un panel **Resumen financiero** que resta los gastos registrados en Gastos a las ventas, mostrando "Ganancia neta" tanto de hoy como del mes en curso (las dos, no solo una — así se ve completo de un vistazo, como en cualquier reporte de caja diario/mensual). El PDF y el Excel que exportas desde ahí ahora también incluyen, arriba de la tabla de detalle, los tres montos: Ventas totales, Gastos totales y Ganancia neta — del período que tengas seleccionado (día o mes).

## Inicio de sesión (usuario y contraseña)
El login solo se pide una vez, al entrar por `index.html` (Punto de venta) — de ahí en adelante puedes moverte a Gastos y a Ventas y reportes sin que te lo vuelvan a pedir.
- Usuario y contraseña por defecto: **admin / admin**. Se cambian en `store.js`, en el objeto `AUTH` (arriba del archivo).
- "Cerrar sesión" está en la barra de navegación de cada pantalla.
- Esto por sí solo es solo una puerta de entrada — para que los datos también viajen entre dispositivos necesitas activar la sincronización en la nube (siguiente sección). Sin eso, cada dispositivo sigue guardando su propia copia local, igual que antes.

## Sincronización en la nube (para que los datos no dependan de una sola PC)
Esto es lo que resuelve "si se daña la PC, no perder lo del mes". El sistema usa **Firebase Firestore** (gratis, de Google) como base de datos central: cualquier dispositivo con el enlace del sitio + usuario/contraseña ve y guarda la misma información.

**Por defecto viene apagado** — mientras no lo actives, la app funciona exactamente igual que antes (todo guardado solo en el navegador de esa PC). Para activarlo:

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) e inicia sesión con una cuenta de Google (la del negocio, idealmente).
2. Crea un proyecto nuevo (le puedes poner "Volcano Vibes POS"). No hace falta plan de pago.
3. En el menú izquierdo entra a **Firestore Database** → "Crear base de datos" → modo producción → elige la región más cercana (ej. `us-central`).
4. En **Configuración del proyecto** (el engranaje, arriba a la izquierda) → pestaña "General" → sección "Tus apps" → agrega una app web (el ícono `</>`). Le pones un nombre y Firebase te muestra un bloque `firebaseConfig = {...}`.
5. Abre `store.js`, busca `const FIREBASE_CONFIG = {` (cerca de la línea 45) y pega ahí adentro los valores que te dio Firebase (`apiKey`, `authDomain`, `projectId`, etc.), quitando el `//` de cada línea.
6. En Firestore, en la pestaña "Reglas", por ahora puedes dejar el modo de prueba (abierto) mientras pruebas, y luego restringirlo. Si quieres, dime y te paso una regla básica para dejarlo protegido con la cuenta admin.
7. Sube los archivos actualizados a donde tengas el sitio (Netlify, etc.) — listo, desde ese momento cualquier dispositivo que entre con admin/admin comparte los mismos datos.

Sin este paso, el login funciona igual, pero cada aparato sigue guardando su copia por separado — el login por sí solo no mueve datos entre dispositivos, necesita esta base de datos detrás.

## Siguientes pasos sugeridos
- Conectar el cobro (`registerSale` en `store.js`) a tu backend/ERP real con el patrón de cola y reintentos que ya conversamos, para que no dependa de `localStorage`.
- Reemplazar los datos de `NEGOCIO` en `store.js` (cédula, teléfono) por los reales del negocio.
- Ajustar precios y categorías del catálogo en `store.js` según el menú final.
