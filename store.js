/* ---------- store.js : datos y persistencia compartidos entre pantallas ---------- */
window.VV = (function(){
  "use strict";

  const NEGOCIO = {
    nombre: "Volcano Vibes",
    cedula: "3-101-XXXXXX",
    telefono: "8888-0000",
    ubicacion: "La Fortuna, San Carlos",
    iva: 0.13
  };

  const PRODUCTS = [
    // Hamburguesas Volcano
    { id: "h1", cat: "hamburguesas", name: "Hamburguesa Volcano (Pollo o Carne)", desc: "Hamburguesas Volcano", price: 5000 },
    { id: "h2", cat: "hamburguesas", name: "Hamburguesa Mediterránea", desc: "Hamburguesas Volcano", price: 4850 },
    { id: "h3", cat: "hamburguesas", name: "Hamburguesa Hawaiana", desc: "Hamburguesas Volcano", price: 4850 },
    { id: "h4", cat: "hamburguesas", name: "Hamburguesa BBQ", desc: "Hamburguesas Volcano", price: 4850 },
    { id: "h5", cat: "hamburguesas", name: "Hamburguesa Tocinito", desc: "Hamburguesas Volcano", price: 3450 },
    { id: "h6", cat: "hamburguesas", name: "Hamburguesa Jamón", desc: "Hamburguesas Volcano", price: 3450 },
    { id: "h7", cat: "hamburguesas", name: "Hamburguesa Queso", desc: "Hamburguesas Volcano", price: 2850 },

    // Burritos y Wraps
    { id: "b1", cat: "burritos", name: "Burrito Desayuno", desc: "Burritos y Wraps", price: 4850 },
    { id: "b2", cat: "burritos", name: "Wrap Camarón", desc: "Burritos y Wraps", price: 5000 },
    { id: "b3", cat: "burritos", name: "Wrap Pescado", desc: "Burritos y Wraps", price: 4850 },
    { id: "b4", cat: "burritos", name: "Wrap Pollo BBQ", desc: "Burritos y Wraps", price: 4850 },
    { id: "b5", cat: "burritos", name: "Wrap Vegetariano", desc: "Burritos y Wraps", price: 4250 },

    // Nachos y Papas
    { id: "n1", cat: "nachos", name: "Nacho Mixto (El Favorito)", desc: "Nachos y Papas", price: 4950 },
    { id: "n2", cat: "nachos", name: "Nacho Pollo", desc: "Nachos y Papas", price: 3850 },
    { id: "n3", cat: "nachos", name: "Nacho Carne", desc: "Nachos y Papas", price: 3850 },
    { id: "n4", cat: "nachos", name: "Nacho Queso", desc: "Nachos y Papas", price: 2850 },
    { id: "n5", cat: "nachos", name: "Papa Asada (Loca)", desc: "Nachos y Papas", price: 2650 },
    { id: "n6", cat: "nachos", name: "Salchipapas", desc: "Nachos y Papas", price: 2950 },
    { id: "n7", cat: "nachos", name: "Papas Fritas (Locas)", desc: "Nachos y Papas", price: 1850 },

    // Quesadillas
    { id: "q1", cat: "quesadillas", name: "Quesadilla Camarón", desc: "Quesadillas", price: 5000 },
    { id: "q2", cat: "quesadillas", name: "Quesadilla Carne", desc: "Quesadillas", price: 3950 },
    { id: "q3", cat: "quesadillas", name: "Quesadilla Pollo", desc: "Quesadillas", price: 3950 },
    { id: "q4", cat: "quesadillas", name: "Quesadilla Vegetariana", desc: "Quesadillas", price: 2950 },
    { id: "q5", cat: "quesadillas", name: "Quesadilla Queso", desc: "Quesadillas", price: 2650 },

    // Combos Volcano
    { id: "c1", cat: "combos", name: "Nachos Queso + Papas + Fresco", desc: "Combos Volcano", price: 6950 },
    { id: "c2", cat: "combos", name: "Salchipapas + Hamb. Queso + Fresco", desc: "Combos Volcano", price: 5850 },
    { id: "c3", cat: "combos", name: "2 Hamb. Queso + Fresco", desc: "Combos Volcano", price: 4850 },
    { id: "c4", cat: "combos", name: "1 Hamb. Queso Sencilla", desc: "Combos Volcano", price: 1650 },
    { id: "c5", cat: "combos", name: "1 Burrito Queso Batata", desc: "Combos Volcano", price: 1750 },
    { id: "c6", cat: "combos", name: "Dedos de Pollo o Pescado", desc: "Combos Volcano", price: 3950 },
    { id: "c7", cat: "combos", name: "Orden de Papas (Sola)", desc: "Combos Volcano", price: 1200 },

    // Ceviches y Caldosas
    { id: "v1", cat: "ceviches", name: "Ceviche Pescado (Chico)", desc: "Ceviches y Caldosas", price: 1650 },
    { id: "v2", cat: "ceviches", name: "Ceviche Pescado (Mediano)", desc: "Ceviches y Caldosas", price: 2650 },
    { id: "v3", cat: "ceviches", name: "Ceviche Pescado (Grande)", desc: "Ceviches y Caldosas", price: 3650 },
    { id: "v4", cat: "ceviches", name: "Ceviche Camarón", desc: "Ceviches y Caldosas", price: 4950 },
    { id: "v5", cat: "ceviches", name: "Caldosa (Chica)", desc: "Ceviches y Caldosas", price: 500 },
    { id: "v6", cat: "ceviches", name: "Caldosa (Grande)", desc: "Ceviches y Caldosas", price: 1000 },
    { id: "v7", cat: "ceviches", name: "Chichaldosa", desc: "Ceviches y Caldosas", price: 3950 },

    // Batidos y Bebidas
    { id: "d1", cat: "bebidas", name: "Mangonada", desc: "Batidos y Bebidas", price: 2650 },
    { id: "d2", cat: "bebidas", name: "Batido de Fresa(Leche)", desc: "Batidos y Bebidas", price: 1950 },
    { id: "d3", cat: "bebidas", name: "Batido de Piña(Leche)", desc: "Batidos y Bebidas", price: 1950 },
    { id: "d4", cat: "bebidas", name: "Batido de Mango(Leche)", desc: "Batidos y Bebidas", price: 1950 },
    { id: "d5", cat: "bebidas", name: "Batido de Fresa(Agua)", desc: "Batidos y Bebidas", price: 1250 },
    { id: "d6", cat: "bebidas", name: "Batido de Piña(Agua)", desc: "Batidos y Bebidas", price: 1250 },
    { id: "d7", cat: "bebidas", name: "Batido de Mango(Agua)", desc: "Batidos y Bebidas", price: 1250 },
    { id: "d8", cat: "bebidas", name: "Café Frío Volcano", desc: "Batidos y Bebidas", price: 1950 },
    { id: "d9", cat: "bebidas", name: "Bebida Gaseosa", desc: "Batidos y Bebidas", price: 0, displayPrice: "NO DISPONIBLE" },
  ];

  const CATEGORIES = [
    { id: "todos", label: "Todos" },
    { id: "hamburguesas", label: "Hamburguesas" },
    { id: "burritos", label: "Burritos y Wraps" },
    { id: "nachos", label: "Nachos y Papas" },
    { id: "quesadillas", label: "Quesadillas" },
    { id: "combos", label: "Combos" },
    { id: "ceviches", label: "Ceviches y Caldosas" },
    { id: "bebidas", label: "Batidos y Bebidas" },
  ];

  // Insumos frecuentes de compra (sin precio fijo: el precio siempre lo digita quien registra el gasto)
  const SUPPLIES = [
    { id: "s1", name: "Carne de res (bulto)" },
    { id: "s2", name: "Pan de hamburguesa" },
    { id: "s3", name: "Queso" },
    { id: "s4", name: "Queso cheddar" },
    { id: "s5", name: "Papas congeladas" },
    { id: "s6", name: "Papa fresca" },
    { id: "s7", name: "Lechuga" },
    { id: "s8", name: "Tomate" },
    { id: "s9", name: "Cebolla" },
    { id: "s10", name: "Tortillas" },
    { id: "s11", name: "Chips de tortilla (nachos)" },
    { id: "s12", name: "Salsas" },
    { id: "s13", name: "Tocineta" },
    { id: "s14", name: "Jamón" },
    { id: "s15", name: "Pollo" },
    { id: "s16", name: "Camarón" },
    { id: "s17", name: "Pescado" },
    { id: "s18", name: "Jalapeños" },
    { id: "s19", name: "Crema" },
    { id: "s20", name: "Aguacate / guacamole" },
    { id: "s21", name: "Limón" },
    { id: "s22", name: "Cilantro / culantro" },
    { id: "s23", name: "Chile picante / Tajín" },
    { id: "s24", name: "Mango" },
    { id: "s25", name: "Fresa" },
    { id: "s26", name: "Piña" },
    { id: "s27", name: "Leche condensada" },
    { id: "s28", name: "Hielo" },
    { id: "s29", name: "Azúcar" },
    { id: "s30", name: "Vasos y empaques" },
    { id: "s31", name: "Vasos para batidos" },
    { id: "s32", name: "Empaques para ceviche" },
    { id: "s33", name: "Pajillas / sorbetes" },
    { id: "s34", name: "Servilletas" },
    { id: "s35", name: "Bolsas para llevar" },
    { id: "s36", name: "Gas / Propano" },
    { id: "s37", name: "Aceite" },
    { id: "s38", name: "Gaseosas / bebidas" },
    { id: "s39", name: "Productos de limpieza" },
  ];

  const CRC = n => "\u20a1" + Math.round(n).toLocaleString("es-CR");

  const pad2 = n => String(n).padStart(2, "0");
  const todayKey = () => {
    const now = new Date();
    return now.getFullYear() + "-" + pad2(now.getMonth() + 1) + "-" + pad2(now.getDate());
  };
  const monthKey = dateStr => dateStr.slice(0, 7);
  const businessYear = () => new Date().getFullYear();

  function readJSON(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(err){
      console.warn("No se pudieron leer los datos guardados:", key, err);
      return fallback;
    }
  }

  function newId(){
    if(window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, char => {
      const random = Math.random() * 16 | 0;
      return (char === "x" ? random : (random & 3 | 8)).toString(16);
    });
  }

  function createOpenDay(now){
    const openedAt = now || Date.now();
    return { id: newId(), businessDate: todayKey(), openedAt };
  }

  function getOpenDay(){
    const stored = readJSON("vv_openDay", null);
    if(stored && stored.id && /^\d{4}-\d{2}-\d{2}$/.test(stored.businessDate) && stored.openedAt){
      return stored;
    }
    const openDay = createOpenDay();
    localStorage.setItem("vv_openDay", JSON.stringify(openDay));
    scheduleCloudPush();
    return openDay;
  }

  /* =========================================================
     LOGIN (acceso con usuario y contraseña)
     Por defecto admin / admin. Cámbialo aquí mismo cuando quieras.
     ========================================================= */
  const AUTH = {
    USER: "admin",
    PASS: "admin",
    currentUser(){ return localStorage.getItem("vv_user") || (AUTH.isLoggedIn() ? AUTH.USER : "Cajero"); },
    isLoggedIn(){ return localStorage.getItem("vv_auth") === "1"; },
    login(user, pass){
      if(user === AUTH.USER && pass === AUTH.PASS){
        localStorage.setItem("vv_auth", "1");
        localStorage.setItem("vv_user", user);
        return true;
      }
      return false;
    },
    logout(){ localStorage.removeItem("vv_auth"); localStorage.removeItem("vv_user"); },
    requireLogin(){
      if(!AUTH.isLoggedIn() && !location.pathname.endsWith("login.html")){
        location.href = "login.html";
      }
    }
  };

  /* =========================================================
     SINCRONIZACIÓN EN LA NUBE (Firebase Firestore)
     Así los datos de la cuenta admin no dependen de una sola PC:
     quedan guardados en internet y cualquier dispositivo con el
     enlace + usuario/contraseña ve la misma información.

     Para activarla: crea un proyecto gratis en https://console.firebase.google.com,
     activa "Firestore Database" (modo producción o prueba) y pega aquí
     los datos que te da la consola en "Configuración del proyecto".
     Mientras este objeto esté vacío, la app sigue funcionando
     normal pero guardando SOLO en este navegador (como antes).
     ========================================================= */
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBwT3IBReIkJbHZMXBE1J3hSOqGcxK8e-c",
    authDomain: "volcano-vibes.firebaseapp.com",
    projectId: "volcano-vibes",
    storageBucket: "volcano-vibes.firebasestorage.app",
    messagingSenderId: "761185992554",
    appId: "1:761185992554:web:8ecfb72bfc14f871ceef13",
    measurementId: "G-N0EJLN0CV2"
  };
  const CLOUD_DOC_PATH = ["volcano_vibes", "admin"]; // colección / documento en Firestore

  let cloudDb = null;
  let cloudReady = false;
  let cloudPushTimer = null;

  function isCloudConfigured(){ return !!FIREBASE_CONFIG.apiKey; }

  function initCloud(){
    if(!isCloudConfigured() || cloudReady) return;
    if(typeof firebase === "undefined"){ return; } // SDK no cargado en esta página
    try{
      firebase.initializeApp(FIREBASE_CONFIG);
      cloudDb = firebase.firestore();
      cloudReady = true;
      const ref = cloudDb.collection(CLOUD_DOC_PATH[0]).doc(CLOUD_DOC_PATH[1]);
      ref.onSnapshot(snap => {
        if(!snap.exists) return;
        const remote = snap.data();
        const localUpdatedAt = parseInt(localStorage.getItem("vv_updated_at") || "0", 10);
        // Solo aplica lo remoto si es más nuevo que lo que ya tenemos aquí,
        // para no pisar cambios locales recién hechos en este mismo dispositivo.
        if(remote.updatedAt && remote.updatedAt > localUpdatedAt){
          applyCloudState(remote);
          window.dispatchEvent(new CustomEvent("vv:cloud-sync"));
        }
      });
    }catch(err){
      console.warn("No se pudo conectar con la nube:", err);
    }
  }

  function localState(){
    return {
      vv_day_sales: localStorage.getItem("vv_day_sales"),
      vv_archive: localStorage.getItem("vv_archive"),
      vv_expense_day: localStorage.getItem("vv_expense_day"),
      vv_expense_archive: localStorage.getItem("vv_expense_archive"),
      vv_openDay: localStorage.getItem("vv_openDay"),
      vv_closures: localStorage.getItem("vv_closures"),
      vv_invoice_seq: localStorage.getItem("vv_invoice_seq_" + businessYear())
    };
  }

  function applyCloudState(remote){
    ["vv_day_sales","vv_archive","vv_expense_day","vv_expense_archive","vv_openDay","vv_closures"].forEach(k => {
      if(remote[k] !== undefined && remote[k] !== null) localStorage.setItem(k, remote[k]);
    });
    if(remote.vv_invoice_seq !== undefined && remote.vv_invoice_seq !== null){
      localStorage.setItem("vv_invoice_seq_" + businessYear(), remote.vv_invoice_seq);
    }
    localStorage.setItem("vv_updated_at", String(remote.updatedAt || Date.now()));
    if(hasUnmigratedRecords()){
      localStorage.removeItem("vv_day_migration_v1");
      migrateRecords();
    }
  }

  function hasUnmigratedRecords(){
    const storedRecords = [
      readJSON("vv_archive", []),
      readJSON("vv_expense_archive", []),
      (readJSON("vv_day_sales", {}) || {}).items || [],
      (readJSON("vv_expense_day", {}) || {}).items || []
    ];
    return storedRecords.some(records => Array.isArray(records)
      && records.some(item => !item || !item.dayId || !item.businessDate));
  }

  // Agrupa varias escrituras seguidas (ej. varias líneas de un carrito) en un solo envío a la nube.
  function scheduleCloudPush(){
    const now = Date.now();
    localStorage.setItem("vv_updated_at", String(now));
    if(!isCloudConfigured() || !cloudReady) return;
    clearTimeout(cloudPushTimer);
    cloudPushTimer = setTimeout(() => {
      const ref = cloudDb.collection(CLOUD_DOC_PATH[0]).doc(CLOUD_DOC_PATH[1]);
      const state = localState();
      state.updatedAt = now;
      ref.set(state, { merge: true }).catch(err => console.warn("No se pudo guardar en la nube:", err));
    }, 400);
  }

  /* ---------- Ventas del día / archivo mensual ---------- */
  function loadDay(){
    const openDay = getOpenDay();
    const stored = readJSON("vv_day_sales", null) || {};
    const items = Array.isArray(stored.items) ? stored.items : [];
    return { date: openDay.businessDate, dayId: openDay.id, items: items.filter(item => item.dayId === openDay.id) };
  }
  function saveDay(day){ localStorage.setItem("vv_day_sales", JSON.stringify(day)); scheduleCloudPush(); }

  function loadArchive(){
    const archive = readJSON("vv_archive", []);
    return Array.isArray(archive) ? archive : [];
  }
  function getOpenDaySales(){
    const dayId = getOpenDay().id;
    return loadArchive().filter(item => item.dayId === dayId).concat(loadDay().items);
  }
  function saveArchive(arr){ localStorage.setItem("vv_archive", JSON.stringify(arr)); scheduleCloudPush(); }

  function archiveItems(date, items){
    const arch = loadArchive();
    items.forEach(it => arch.push({ ...it, date: it.businessDate || date }));
    saveArchive(arch);
  }

  function getMonthRows(day){
    const mKey = monthKey(getOpenDay().businessDate);
    const map = new Map();
    loadArchive().filter(r => r.businessDate && monthKey(r.businessDate) === mKey).forEach(r => {
      const cur = map.get(r.product) || { product: r.product, qty: 0, total: 0 };
      cur.qty += r.qty; cur.total += r.total;
      map.set(r.product, cur);
    });
    day.items.filter(r => r.businessDate && monthKey(r.businessDate) === mKey).forEach(r => {
      const cur = map.get(r.product) || { product: r.product, qty: 0, total: 0 };
      cur.qty += r.qty; cur.total += r.total;
      map.set(r.product, cur);
    });
    return Array.from(map.values()).sort((a,b) => b.total - a.total);
  }

  /* ---------- Numeración de factura ---------- */
  function nextInvoiceNumber(){
    const year = businessYear();
    const key = "vv_invoice_seq_" + year;
    let n = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, String(n));
    scheduleCloudPush();
    return "FS/" + year + "/" + String(n).padStart(4, "0");
  }

  /* ---------- Registrar una venta cobrada (líneas del carrito) ---------- */
  function registerSale(cartLines, paymentMethod){
    if(paymentMethod !== "cash" && paymentMethod !== "card"){
      throw new TypeError("El método de pago debe ser cash o card.");
    }
    const day = loadDay();
    const now = new Date();
    const openDay = getOpenDay();
    const hora = now.toLocaleTimeString("es-CR", {
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    });
    cartLines.forEach(item => {
      day.items.push({
        time: hora, ts: now.getTime(), createdAt: now.toISOString(), dayId: openDay.id,
        businessDate: openDay.businessDate, paymentMethod,
        product: item.name, qty: item.qty, unit: item.price, total: item.qty * item.price
      });
    });
    saveDay(day);
    return day;
  }

  /* ---------- Gastos / compras de insumos (independiente de las ventas) ---------- */
  function loadExpenseDay(){
    const openDay = getOpenDay();
    const stored = readJSON("vv_expense_day", null) || {};
    const items = Array.isArray(stored.items) ? stored.items : [];
    return { date: openDay.businessDate, dayId: openDay.id, items: items.filter(item => item.dayId === openDay.id) };
  }
  function saveExpenseDay(day){ localStorage.setItem("vv_expense_day", JSON.stringify(day)); scheduleCloudPush(); }

  function loadExpenseArchive(){
    const archive = readJSON("vv_expense_archive", []);
    return Array.isArray(archive) ? archive : [];
  }
  function getOpenDayExpenses(){
    const dayId = getOpenDay().id;
    return loadExpenseArchive().filter(item => item.dayId === dayId).concat(loadExpenseDay().items);
  }
  function saveExpenseArchive(arr){ localStorage.setItem("vv_expense_archive", JSON.stringify(arr)); scheduleCloudPush(); }

  function archiveExpenseItems(date, items){
    const arch = loadExpenseArchive();
    items.forEach(it => arch.push({ ...it, date: it.businessDate || date }));
    saveExpenseArchive(arch);
  }

  function getExpenseMonthRows(day){
    const mKey = monthKey(getOpenDay().businessDate);
    const map = new Map();
    loadExpenseArchive().filter(r => r.businessDate && monthKey(r.businessDate) === mKey).forEach(r => {
      const cur = map.get(r.product) || { product: r.product, qty: 0, total: 0 };
      cur.qty += r.qty; cur.total += r.total;
      map.set(r.product, cur);
    });
    day.items.filter(r => r.businessDate && monthKey(r.businessDate) === mKey).forEach(r => {
      const cur = map.get(r.product) || { product: r.product, qty: 0, total: 0 };
      cur.qty += r.qty; cur.total += r.total;
      map.set(r.product, cur);
    });
    return Array.from(map.values()).sort((a,b) => b.total - a.total);
  }

  function registerExpense(lines){
    const day = loadExpenseDay();
    const now = new Date();
    const openDay = getOpenDay();
    const hora = now.toLocaleTimeString("es-CR", {
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    });
    lines.forEach(item => {
      day.items.push({
        time: hora, ts: now.getTime(), dayId: openDay.id, businessDate: openDay.businessDate,
        product: item.name, qty: item.qty, unit: item.price, total: item.qty * item.price
      });
    });
    saveExpenseDay(day);
    return day;
  }

  function localDateFromTimestamp(value){
    const date = new Date(value);
    if(Number.isNaN(date.getTime())) return "";
    return date.getFullYear() + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
  }

  function migrateRecords(){
    if(localStorage.getItem("vv_day_migration_v1") === "1") return;
    const openDay = getOpenDay();
    const normalize = (item, fallbackDate) => {
      const businessDate = item.businessDate || localDateFromTimestamp(item.ts || item.createdAt)
        || (/^\d{4}-\d{2}-\d{2}$/.test(item.date || "") ? item.date : "")
        || fallbackDate || openDay.businessDate;
      return {
        ...item,
        date: businessDate,
        businessDate,
        dayId: item.dayId || (businessDate === openDay.businessDate ? openDay.id : "legacy-" + businessDate)
      };
    };
    const sales = loadArchive().map(item => normalize(item, ""));
    const salesDay = readJSON("vv_day_sales", {}) || {};
    (Array.isArray(salesDay.items) ? salesDay.items : []).forEach(item => sales.push(normalize(item, salesDay.date)));
    const expenses = loadExpenseArchive().map(item => normalize(item, ""));
    const expensesDay = readJSON("vv_expense_day", {}) || {};
    (Array.isArray(expensesDay.items) ? expensesDay.items : []).forEach(item => expenses.push(normalize(item, expensesDay.date)));
    localStorage.setItem("vv_archive", JSON.stringify(sales));
    localStorage.setItem("vv_day_sales", JSON.stringify({ date: openDay.businessDate, dayId: openDay.id, items: [] }));
    localStorage.setItem("vv_expense_archive", JSON.stringify(expenses));
    localStorage.setItem("vv_expense_day", JSON.stringify({ date: openDay.businessDate, dayId: openDay.id, items: [] }));
    localStorage.setItem("vv_day_migration_v1", "1");
    scheduleCloudPush();
  }

  function loadClosures(){
    const closures = readJSON("vv_closures", []);
    return Array.isArray(closures) ? closures : [];
  }

  function closeOpenDay(){
    const openDay = getOpenDay();
    const currentSales = loadDay().items;
    const currentExpenses = loadExpenseDay().items;
    const sales = getOpenDaySales();
    const expenses = getOpenDayExpenses();
    const now = Date.now();
    const totalSales = sales.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const closure = {
      dayId: openDay.id, businessDate: openDay.businessDate, openedAt: openDay.openedAt,
      closedAt: now, totalSales, totalExpenses, net: totalSales - totalExpenses,
      dishes: sales.reduce((sum, item) => sum + (Number(item.qty) || 0), 0)
    };
    archiveItems(openDay.businessDate, currentSales);
    archiveExpenseItems(openDay.businessDate, currentExpenses);
    saveDay({ date: openDay.businessDate, dayId: openDay.id, items: [] });
    saveExpenseDay({ date: openDay.businessDate, dayId: openDay.id, items: [] });
    const closures = loadClosures();
    closures.push(closure);
    localStorage.setItem("vv_closures", JSON.stringify(closures));
    localStorage.setItem("vv_openDay", JSON.stringify(createOpenDay(now)));
    scheduleCloudPush();
    return closure;
  }

  migrateRecords();

  return {
    NEGOCIO, PRODUCTS, CATEGORIES, SUPPLIES, CRC,
    todayKey, monthKey, getOpenDay,
    loadDay, saveDay, loadArchive, saveArchive, archiveItems, getMonthRows, getOpenDaySales,
    nextInvoiceNumber, registerSale,
    loadExpenseDay, saveExpenseDay, loadExpenseArchive, saveExpenseArchive,
    archiveExpenseItems, getExpenseMonthRows, registerExpense, getOpenDayExpenses, loadClosures, closeOpenDay,
    AUTH, initCloud, isCloudConfigured
  };
})();
