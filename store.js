/* ---------- store.js : datos y persistencia compartidos entre pantallas ---------- */
window.VV = (function(){
  "use strict";

  const NEGOCIO = {
    nombre: "Volcano Vibes",
    cedula: "3-101-XXXXXX",
    telefono: "8888-0000",
    ubicacion: "La Fortuna, San Carlos",
    iva: 0
  };

  const PRODUCTS = [
    // Hamburguesas Volcano
    { id: "h1", cat: "hamburguesas", name: "Hamburguesa Volcano (Pollo o Carne)", desc: "Hamburguesas Volcano", price: 5000 },
    { id: "h2", cat: "hamburguesas", name: "Hamburguesa Mediterránea", desc: "Hamburguesas Volcano", price: 4850 },
    { id: "h3", cat: "hamburguesas", name: "Hamburguesa Hawaiana", desc: "Hamburguesas Volcano", price: 4850 },
    { id: "h4", cat: "hamburguesas", name: "Hamburguesa BBQ", desc: "Hamburguesas Volcano", price: 4850 },
    { id: "h5", cat: "hamburguesas", name: "Hamburguesa Tocino", desc: "Hamburguesas Volcano", price: 3450 },
    { id: "h6", cat: "hamburguesas", name: "Hamburguesa Jamón", desc: "Hamburguesas Volcano", price: 3450 },
    { id: "h7", cat: "hamburguesas", name: "Hamburguesa Queso", desc: "Hamburguesas Volcano", price: 2850 },

    // Burritos y Wraps
    { id: "b1", cat: "burritos", name: "Burrito Desayuno", desc: "Burritos y Wraps", price: 4850 },
    { id: "b2", cat: "burritos", name: "Wrap Camarón", desc: "Burritos y Wraps", price: 5000 },
    { id: "b3", cat: "burritos", name: "Wrap Pescado", desc: "Burritos y Wraps", price: 4850 },
    { id: "b4", cat: "burritos", name: "Wrap Pollo BBQ", desc: "Burritos y Wraps", price: 4850 },
    { id: "b5", cat: "burritos", name: "Wrap Vegetariano", desc: "Burritos y Wraps", price: 4250 },

    // Nachos y Papas
    { id: "n1", cat: "nachos", name: "Nacho Mixto Arenal (El Favorito)", desc: "Nachos y Papas", price: 4950 },
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
    { id: "c6", cat: "combos", name: "Dedos Pollo o Pescado", desc: "Combos Volcano", price: 3950 },
    { id: "c7", cat: "combos", name: "Orden de Papas (Sola)", desc: "Combos Volcano", price: 1200 },

    // Ceviches y Caldosas
    { id: "v1", cat: "ceviches", name: "Ceviche Pescado (Chico)", desc: "Ceviches y Caldosas", price: 1650 },
    { id: "v2", cat: "ceviches", name: "Ceviche Pescado (Mediano)", desc: "Ceviches y Caldosas", price: 2650 },
    { id: "v3", cat: "ceviches", name: "Ceviche Pescado (Grande)", desc: "Ceviches y Caldosas", price: 3650 },
    { id: "v4", cat: "ceviches", name: "Ceviche Camarón", desc: "Ceviches y Caldosas", price: 4950 },
    { id: "v5", cat: "ceviches", name: "Caldosa (Chica)", desc: "Ceviches y Caldosas", price: 500 },
    { id: "v6", cat: "ceviches", name: "Caldosa (Grande)", desc: "Ceviches y Caldosas", price: 1000 },
    { id: "v8", cat: "ceviches", name: "Chichaldosa (Chica)", desc: "Ceviches y Caldosas", price: 1950 },
    { id: "v7", cat: "ceviches", name: "Chichaldosa (Grande)", desc: "Ceviches y Caldosas", price: 3950 },

    // Batidos y Bebidas
    { id: "d1", cat: "bebidas", name: "Mangonada", desc: "Batidos y Bebidas", price: 2650 },
    { id: "d2", cat: "bebidas", name: "Batido de Fresa(Leche)", desc: "Batidos y Bebidas", price: 1950 },
    { id: "d3", cat: "bebidas", name: "Batido de Piña(Leche)", desc: "Batidos y Bebidas", price: 1950 },
    { id: "d4", cat: "bebidas", name: "Batido de Mango(Leche)", desc: "Batidos y Bebidas", price: 1950 },
    { id: "d5", cat: "bebidas", name: "Batido de Fresa(Agua)", desc: "Batidos y Bebidas", price: 1250 },
    { id: "d6", cat: "bebidas", name: "Batido de Piña(Agua)", desc: "Batidos y Bebidas", price: 1250 },
    { id: "d7", cat: "bebidas", name: "Batido de Mango(Agua)", desc: "Batidos y Bebidas", price: 1250 },
    { id: "d8", cat: "bebidas", name: "Café Frío Volcano", desc: "Batidos y Bebidas", price: 1950 },
    { id: "d9", cat: "bebidas", name: "Bebida Gaseosa", desc: "Batidos y Bebidas", price: 1200 },
  ];
  const SODA_PRODUCT_ID = "d9";
  const SODA_PRICE = 1200;

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
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

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
    if(cloudState && cloudState.vv_openDay) return cloudState.vv_openDay;
    return { id: "loading", businessDate: todayKey(), openedAt: 0 };
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

  /* Firestore es la autoridad para el estado compartido; localStorage es solo caché y cola de reintentos. */
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
  let cloudRef = null;
  let cloudStatus = "initializing";
  let cloudReady = false;
  let cloudConflict = false;
  let cloudBackupReady = false;
  let cloudLocalBackupPending = false;
  let cloudRemoteExists = false;
  let cloudState = null;
  let cloudUnsubscribe = null;
  let cloudInitPromise = null;
  let cloudError = null;
  const pendingOperationIds = new Map();
  const CLOUD_FIELDS = [
    "vv_day_sales", "vv_archive", "vv_expense_day", "vv_expense_archive",
    "vv_openDay", "vv_closures", "vv_invoice_seq"
  ];
  const CLOUD_CACHE_MARKER = "vv_cloud_cache_signature";
  const PENDING_OPERATIONS_KEY = "vv_pending_operations";
  const CONFLICT_BACKUP_KEY = "vv_sync_conflict_backup";

  function isCloudConfigured(){ return !!FIREBASE_CONFIG.apiKey; }
  function cloudSnapshot(){ return cloudState; }
  function isCloudReady(){ return cloudReady && !cloudConflict; }
  function getCloudStatus(){ return { status: cloudStatus, error: cloudError, conflict: cloudConflict }; }

  function emitCloudReadyStatus(){
    emitCloudStatus(cloudLocalBackupPending ? "loaded-backup-error" : "loaded",
      cloudLocalBackupPending ? new Error("No se pudo guardar una copia de respaldo de los datos locales divergentes.") : null);
  }

  function emitCloudStatus(status, error){
    cloudStatus = status;
    cloudError = error || null;
    const statusElement = document.getElementById("cloudStatusText");
    const retryButton = document.getElementById("retryCloud");
    const statusMessages = {
      initializing: "Conectando con Firestore…",
      loaded: "Datos sincronizados con Firestore.",
      "loaded-backup-error": "Firestore está activo, pero no se pudo respaldar la caché local divergente. Se conserva intacta y puedes reintentar.",
      empty: "Firestore estaba vacío; se inicializó un turno compartido.",
      conflict: "Conflicto de datos locales. No se sobrescribió la copia local y las escrituras están pausadas.",
      "connection-error": "Sin conexión con Firestore. Los cobros y cambios están pausados.",
      "permission-error": "Firestore denegó el acceso. Revisa los permisos de la cuenta.",
      "read-error": "No se pudieron leer los datos de Firestore.",
      "write-error": "No se pudo confirmar el cambio en Firestore. El carrito se conserva para reintentar."
    };
    const pendingCount = readPendingOperations().length;
    if(statusElement){
      statusElement.textContent = statusMessages[status] || "Estado de Firestore desconocido.";
      if(pendingCount) statusElement.textContent += " Hay " + pendingCount + " operación(es) local(es) pendientes.";
      statusElement.parentElement.hidden = false;
      statusElement.parentElement.dataset.state = status;
      if(error) statusElement.title = error.message || String(error);
      else statusElement.removeAttribute("title");
    }
    if(retryButton){
      retryButton.hidden = !["connection-error", "permission-error", "read-error", "write-error", "loaded-backup-error"].includes(status);
      if(!retryButton.dataset.bound){
        retryButton.addEventListener("click", () => retryCloud());
        retryButton.dataset.bound = "true";
      }
    }
    const pendingButton = document.getElementById("retryPending");
    if(pendingButton){
      pendingButton.hidden = !pendingCount || !cloudReady || cloudConflict;
      if(!pendingButton.dataset.bound){
        pendingButton.addEventListener("click", () => retryPendingOperations().catch(err => {
          console.error("No se pudieron reintentar las operaciones pendientes:", err);
        }));
        pendingButton.dataset.bound = "true";
      }
    }
    const resolveButton = document.getElementById("useRemoteData");
    if(resolveButton){
      resolveButton.hidden = status !== "conflict" || !cloudRemoteExists;
      if(!resolveButton.dataset.bound){
        resolveButton.addEventListener("click", () => {
          if(!window.confirm("Se conservará una copia local del conflicto, pero los datos mostrados y las próximas escrituras usarán Firestore. ¿Continuar?")) return;
          resolveCloudConflict().catch(err => {
            emitCloudStatus("conflict", err);
            window.alert(err.message || "No se pudo confirmar la lectura remota.");
          });
        });
        resolveButton.dataset.bound = "true";
      }
    }
    window.dispatchEvent(new CustomEvent("vv:cloud-status", { detail: getCloudStatus() }));
  }

  function parseCloudField(value, fallback){
    if(value === undefined || value === null) return fallback;
    if(typeof value !== "string") return value;
    try{ return JSON.parse(value); }
    catch(err){ throw new Error("El documento de Firestore contiene JSON inválido."); }
  }

  function normalizedState(data){
    const raw = data || {};
    const parsed = {};
    CLOUD_FIELDS.forEach(key => {
      const fallback = key === "vv_invoice_seq" ? 0
        : key === "vv_openDay" ? null
        : key === "vv_day_sales" ? { date: "", dayId: "", items: [] }
        : key === "vv_expense_day" ? { date: "", dayId: "", items: [] }
        : [];
      parsed[key] = parseCloudField(raw[key], fallback);
    });
    parsed.vv_products = parseCloudField(raw.vv_products, PRODUCTS);
    parsed.vv_supplies = parseCloudField(raw.vv_supplies, SUPPLIES);
    parsed.updatedAt = raw.updatedAt || 0;
    return parsed;
  }

  function cloudStateValidationError(state){
    const recordArrays = ["vv_archive", "vv_expense_archive", "vv_closures"];
    if(recordArrays.some(key => !Array.isArray(state[key]))) return new Error("Firestore contiene una lista de datos con formato inválido.");
    if(!state.vv_day_sales || !Array.isArray(state.vv_day_sales.items)
      || !state.vv_expense_day || !Array.isArray(state.vv_expense_day.items)){
      return new Error("Firestore contiene un registro diario con formato inválido.");
    }
    const allRecords = [
      ...state.vv_archive, ...state.vv_expense_archive, ...state.vv_closures,
      ...state.vv_day_sales.items, ...state.vv_expense_day.items
    ];
    if(allRecords.some(item => !item || typeof item !== "object" || Array.isArray(item))){
      return new Error("Firestore contiene un registro individual con formato inválido.");
    }
    if(!state.vv_openDay || !state.vv_openDay.id
      || !/^\d{4}-\d{2}-\d{2}$/.test(state.vv_openDay.businessDate)
      || !Number(state.vv_openDay.openedAt)){
      return new Error("El documento remoto no contiene un turno abierto válido.");
    }
    if(!Array.isArray(state.vv_products) || state.vv_products.some(item =>
      !item || typeof item.id !== "string" || typeof item.name !== "string"
      || !Number.isFinite(Number(item.price)))){
      return new Error("Firestore contiene un catálogo de productos inválido.");
    }
    if(!Array.isArray(state.vv_supplies) || state.vv_supplies.some(item =>
      !item || typeof item.id !== "string" || typeof item.name !== "string")){
      return new Error("Firestore contiene una lista de insumos inválida.");
    }
    if(!Number.isFinite(Number(state.vv_invoice_seq)) || Number(state.vv_invoice_seq) < 0){
      return new Error("Firestore contiene una secuencia de facturas inválida.");
    }
    return null;
  }

  function encodeCloudState(state){
    const encoded = {};
    CLOUD_FIELDS.forEach(key => {
      encoded[key] = typeof state[key] === "string" ? state[key] : JSON.stringify(state[key]);
    });
    encoded.vv_products = JSON.stringify(state.vv_products);
    encoded.vv_supplies = JSON.stringify(state.vv_supplies);
    encoded.updatedAt = Date.now();
    return encoded;
  }

  function cloudPatch(state, previous){
    const encoded = {};
    CLOUD_FIELDS.forEach(key => {
      if(JSON.stringify(state[key]) !== JSON.stringify(previous[key])){
        encoded[key] = key === "vv_invoice_seq" ? state[key] : JSON.stringify(state[key]);
      }
    });
    ["vv_products", "vv_supplies"].forEach(key => {
      if(JSON.stringify(state[key]) !== JSON.stringify(previous[key])){
        encoded[key] = JSON.stringify(state[key]);
      }
    });
    if(Object.keys(encoded).length) encoded.updatedAt = Date.now();
    return encoded;
  }

  function persistentLocalState(){
    const state = {};
    CLOUD_FIELDS.forEach(key => {
      const storageKey = key === "vv_invoice_seq" ? "vv_invoice_seq_" + businessYear() : key;
      let value = null;
      try{ value = localStorage.getItem(storageKey); }catch(err){ /* local cache is optional */ }
      if(key === "vv_invoice_seq") state[key] = value === null ? 0 : parseInt(value, 10) || 0;
      else if(value === null){
        state[key] = key === "vv_openDay" ? null
          : key === "vv_day_sales" ? { date: "", dayId: "", items: [] }
          : key === "vv_expense_day" ? { date: "", dayId: "", items: [] } : [];
      }else{
        try{ state[key] = JSON.parse(value); }
        catch(err){ state[key] = { invalidLocalData: value }; }
      }
    });
    return state;
  }

  function stateSignature(state){
    return JSON.stringify(CLOUD_FIELDS.reduce((result, key) => {
      result[key] = state[key];
      return result;
    }, {}));
  }

  function hasLocalBusinessData(state){
    if(CLOUD_FIELDS.some(key => state[key] && state[key].invalidLocalData)) return true;
    return ["vv_day_sales", "vv_archive", "vv_expense_day", "vv_expense_archive", "vv_closures"]
      .some(key => {
        const value = state[key];
        const records = Array.isArray(value) ? value : value && value.items;
        return Array.isArray(records) && records.length > 0;
      }) || Number(state.vv_invoice_seq) > 0
      || !!(state.vv_openDay && state.vv_openDay.id && state.vv_openDay.openedAt);
  }

  function preserveLocalConflict(state){
    try{
      const existing = JSON.parse(localStorage.getItem(CONFLICT_BACKUP_KEY) || "[]");
      const backups = Array.isArray(existing) ? existing : [existing];
      const signature = stateSignature(state);
      if(!backups.some(item => item.signature === signature)){
        backups.push({ capturedAt: new Date().toISOString(), signature, data: state });
        localStorage.setItem(CONFLICT_BACKUP_KEY, JSON.stringify(backups));
      }
      return true;
    }catch(err){
      console.warn("No se pudo guardar la copia local en conflicto:", err);
      return false;
    }
  }

  function cacheConfirmedRemoteState(state, preserveConfirmedCache){
    const local = persistentLocalState();
    const localHasData = hasLocalBusinessData(local);
    const localSignature = stateSignature(local);
    const remoteSignature = stateSignature(state);
    let cachedSignature = null;
    try{ cachedSignature = localStorage.getItem(CLOUD_CACHE_MARKER); }catch(err){ /* optional cache */ }
    const localWasModified = !cachedSignature || cachedSignature !== localSignature;
    const needsBackup = cloudLocalBackupPending || (localHasData
      && localSignature !== remoteSignature
      && (preserveConfirmedCache || localWasModified));
    if(needsBackup && !preserveLocalConflict(local)){
      cloudLocalBackupPending = true;
      return false;
    }
    cloudLocalBackupPending = false;
    cacheRemoteState(state);
    return true;
  }

  async function resolveCloudConflict(){
    if(!cloudConflict || !cloudState) throw new Error("No hay un conflicto local pendiente.");
    if(!cloudRef) throw new Error("Firestore todavía no está conectado; no se resolvió el conflicto.");
    let snapshot;
    try{
      snapshot = await cloudRef.get({ source: "server" });
    }catch(err){
      throw new Error("No se pudo confirmar una lectura actual de Firestore: " + (err.message || "error de lectura."));
    }
    if(!snapshot.exists) throw new Error("Firestore no contiene el documento remoto. No se modificó la copia local.");
    const remote = normalizedState(snapshot.data());
    const validationError = cloudStateValidationError(remote);
    if(validationError) throw new Error("Firestore no contiene un estado operativo válido: " + validationError.message);
    cloudState = remote;
    cloudRemoteExists = true;
    if(!cacheConfirmedRemoteState(remote, true)){
      cloudBackupReady = false;
      throw new Error("No se pudo guardar el respaldo local; no se aplicó la resolución.");
    }
    cloudBackupReady = true;
    if(!cloudBackupReady) throw new Error("No se pudo confirmar que la copia local esté respaldada; no se resolvió el conflicto.");
    if(!cloudRemoteExists) throw new Error("Firestore no tiene una copia remota que pueda elegirse. Se requiere revisar y autorizar una recuperación local.");
    cloudConflict = false;
    cloudReady = true;
    emitCloudReadyStatus();
    window.dispatchEvent(new CustomEvent("vv:cloud-sync"));
  }

  function cacheRemoteState(state){
    CLOUD_FIELDS.forEach(key => {
      const storageKey = key === "vv_invoice_seq" ? "vv_invoice_seq_" + businessYear() : key;
      try{ localStorage.setItem(storageKey, JSON.stringify(state[key])); }
      catch(err){ console.warn("No se pudo actualizar la caché local:", storageKey, err); }
    });
    try{ localStorage.setItem("vv_products", JSON.stringify(state.vv_products)); }catch(err){ /* optional cache */ }
    try{ localStorage.setItem("vv_supplies", JSON.stringify(state.vv_supplies)); }catch(err){ /* optional cache */ }
    try{ localStorage.setItem("vv_openDay", JSON.stringify(state.vv_openDay)); }catch(err){ /* optional cache */ }
    try{ localStorage.setItem(CLOUD_CACHE_MARKER, stateSignature(state)); }catch(err){ /* optional cache */ }
  }

  function installRemoteState(state, initial){
    const validationError = cloudStateValidationError(state);
    if(validationError){
      emitCloudStatus("read-error", validationError);
      cloudReady = false;
      return false;
    }
    cloudState = state;
    cloudRemoteExists = true;
    cloudConflict = false;
    cloudReady = true;
    const cacheReady = cacheConfirmedRemoteState(state, initial);
    emitCloudStatus(cacheReady ? "loaded" : "loaded-backup-error",
      cacheReady ? null : new Error("La lectura remota fue válida, pero no se pudo respaldar la caché local divergente."));
    window.dispatchEvent(new CustomEvent("vv:cloud-sync"));
    return true;
  }

  function emptyCloudState(){
    const openDay = createOpenDay();
    return {
      vv_day_sales: { date: openDay.businessDate, dayId: openDay.id, items: [] },
      vv_archive: [],
      vv_expense_day: { date: openDay.businessDate, dayId: openDay.id, items: [] },
      vv_expense_archive: [],
      vv_openDay: openDay,
      vv_closures: [],
      vv_invoice_seq: 0,
      vv_products: PRODUCTS,
      vv_supplies: SUPPLIES,
      updatedAt: 0
    };
  }

  function classifyCloudError(err, operation){
    const code = String(err && err.code || "").toLowerCase();
    if(code.includes("permission-denied") || code.includes("unauthenticated")) return "permission-error";
    if(code.includes("unavailable") || code.includes("deadline-exceeded") || code.includes("network")) return "connection-error";
    return operation === "read" ? "read-error" : "write-error";
  }

  function initCloud(){
    if(cloudInitPromise) return cloudInitPromise;
    cloudReady = false;
    cloudConflict = false;
    cloudBackupReady = false;
    cloudRemoteExists = false;
    emitCloudStatus("initializing");
    if(!isCloudConfigured()){
      emitCloudStatus("read-error", new Error("Firebase no está configurado."));
      return Promise.resolve(false);
    }
    if(typeof firebase === "undefined"){
      emitCloudStatus("connection-error", new Error("No se pudo cargar el SDK de Firebase."));
      return Promise.resolve(false);
    }
    cloudInitPromise = (async () => {
      let initializationOperation = "read";
      try{
        const app = firebase.apps.find(item => item.options.projectId === FIREBASE_CONFIG.projectId)
          || firebase.initializeApp(FIREBASE_CONFIG);
        cloudDb = app.firestore();
        cloudRef = cloudDb.collection(CLOUD_DOC_PATH[0]).doc(CLOUD_DOC_PATH[1]);
        let initialSnapshot;
        try{
          initialSnapshot = await cloudRef.get({ source: "server" });
        }catch(err){
          emitCloudStatus(classifyCloudError(err, "read"), err);
          return false;
        }
        if(!initialSnapshot.exists || Object.keys(initialSnapshot.data() || {}).length === 0){
          cloudRemoteExists = false;
          const local = persistentLocalState();
          if(hasLocalBusinessData(local)){
            cloudConflict = true;
            cloudState = null;
            cloudBackupReady = preserveLocalConflict(local);
            emitCloudStatus("conflict", new Error("Firestore no contiene el documento, pero este dispositivo conserva registros locales. No se subió ni eliminó ningún dato."));
          }else{
            const initialState = emptyCloudState();
            initializationOperation = "write";
            await cloudDb.runTransaction(async transaction => {
              const current = await transaction.get(cloudRef);
              if(current.exists){
                if(Object.keys(current.data() || {}).length !== 0) return;
                transaction.update(cloudRef, encodeCloudState(initialState));
              }else{
                transaction.set(cloudRef, encodeCloudState(initialState));
              }
            });
            initializationOperation = "read";
            const verified = await cloudRef.get({ source: "server" });
            if(!verified.exists) throw new Error("El documento inicial no apareció después de guardarlo.");
            installRemoteState(normalizedState(verified.data()), true);
            if(cloudReady) emitCloudStatus("empty");
          }
        }else{
          const remote = normalizedState(initialSnapshot.data());
          const valid = installRemoteState(remote, true);
          if(valid){
            const additive = {};
            if(initialSnapshot.data().vv_products === undefined) additive.vv_products = JSON.stringify(PRODUCTS);
            if(initialSnapshot.data().vv_supplies === undefined) additive.vv_supplies = JSON.stringify(SUPPLIES);
            if(Object.keys(additive).length){
              initializationOperation = "write";
              await cloudDb.runTransaction(async transaction => {
                const current = await transaction.get(cloudRef);
                if(!current.exists) throw new Error("El documento desapareció durante la inicialización.");
                const patch = {};
                if(current.data().vv_products === undefined) patch.vv_products = additive.vv_products;
                if(current.data().vv_supplies === undefined) patch.vv_supplies = additive.vv_supplies;
                if(Object.keys(patch).length) transaction.update(cloudRef, patch);
              });
              initializationOperation = "read";
            }
          }
        }
        if(cloudUnsubscribe) cloudUnsubscribe();
        cloudUnsubscribe = cloudRef.onSnapshot({ includeMetadataChanges: true }, snapshot => {
          if(snapshot.metadata && snapshot.metadata.fromCache) return;
          if(!snapshot.exists){
            cloudRemoteExists = false;
            cloudReady = false;
            cloudConflict = false;
            cloudState = null;
            emitCloudStatus("read-error", new Error("El documento de Firestore fue eliminado mientras la aplicación estaba abierta."));
            return;
          }
          try{
            const next = normalizedState(snapshot.data());
            const validationError = cloudStateValidationError(next);
            if(validationError){
              if(cloudConflict){
                emitCloudStatus("conflict", validationError);
                return;
              }
              throw validationError;
            }
            installRemoteState(next, false);
          }catch(err){
            cloudReady = false;
            emitCloudStatus("read-error", err);
          }
        }, err => {
          cloudReady = false;
          emitCloudStatus(classifyCloudError(err, initializationOperation), err);
        });
        return cloudReady;
      }catch(err){
        cloudReady = false;
        emitCloudStatus(classifyCloudError(err, initializationOperation), err);
        console.error("Error al inicializar Firestore:", err);
        return false;
      }
    })();
    return cloudInitPromise;
  }

  function disposeCloud(){
    if(cloudUnsubscribe){
      cloudUnsubscribe();
      cloudUnsubscribe = null;
    }
    cloudInitPromise = null;
    cloudReady = false;
  }

  function retryCloud(){
    disposeCloud();
    cloudConflict = false;
    return initCloud();
  }

  function requireCloudReady(){
    if(cloudConflict) throw new Error("Hay un conflicto local pendiente de resolución. No se realizó la operación.");
    if(!cloudReady || !cloudRef) throw new Error("Firestore aún no está listo. No se realizó la operación.");
  }

  function persistPendingOperation(type, payload){
    const fingerprint = JSON.stringify(payload);
    const key = type + ":" + fingerprint;
    if(pendingOperationIds.has(key)) return pendingOperationIds.get(key);
    try{
      const queue = readPendingOperations();
      const pending = queue.find(item => item.type === type && item.fingerprint === fingerprint);
      if(pending) return pending.id;
      const id = newId();
      pendingOperationIds.set(key, id);
      queue.push({ id, type, fingerprint, payload, createdAt: new Date().toISOString() });
      localStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(queue));
      return id;
    }catch(err){
      if(!pendingOperationIds.has(key)) pendingOperationIds.set(key, newId());
      return pendingOperationIds.get(key);
    }
  }

  function readPendingOperations(){
    try{
      const queue = JSON.parse(localStorage.getItem(PENDING_OPERATIONS_KEY) || "[]");
      return Array.isArray(queue) ? queue : [];
    }catch(err){
      console.warn("No se pudo leer la cola local de operaciones pendientes:", err);
      return [];
    }
  }

  async function retryPendingOperations(){
    requireCloudReady();
    const pending = readPendingOperations();
    if(!pending.length) return;
    if(!window.confirm("Se intentará confirmar " + pending.length + " operación(es) usando sus identificadores idempotentes. ¿Continuar?")) return;
    for(const operation of pending){
      if(operation.type === "sale"){
        await registerSale(operation.payload.lines, operation.payload.paymentMethod, operation.id, operation.payload.dayId);
      }else if(operation.type === "expense"){
        await registerExpense(operation.payload.lines, operation.id, operation.payload.dayId);
      }
    }
    emitCloudStatus("loaded");
  }

  function clearPendingOperation(type, payload){
    const fingerprint = JSON.stringify(payload);
    pendingOperationIds.delete(type + ":" + fingerprint);
    try{
      const queue = JSON.parse(localStorage.getItem(PENDING_OPERATIONS_KEY) || "[]");
      localStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(
        queue.filter(item => !(item.type === type && item.fingerprint === fingerprint))
      ));
    }catch(err){
      console.warn("No se pudo limpiar la cola local de operaciones confirmadas:", err);
    }
  }

  async function transactCloud(mutator){
    requireCloudReady();
    try{
      const result = await cloudDb.runTransaction(async transaction => {
        const snapshot = await transaction.get(cloudRef);
        if(!snapshot.exists) throw new Error("El documento remoto no existe; se detuvo la escritura para evitar recrearlo con datos incompletos.");
        const latest = normalizedState(snapshot.data());
        const validationError = cloudStateValidationError(latest);
        if(validationError) throw validationError;
        const { state, result: operationResult, changed } = mutator(latest);
        if(changed){
          const patch = cloudPatch(state, latest);
          if(!Object.keys(patch).length) return { state: latest, result: operationResult };
          transaction.update(cloudRef, patch);
        }
        return { state: changed ? state : latest, result: operationResult };
      });
      cloudState = result.state;
      cacheConfirmedRemoteState(result.state, false);
      window.dispatchEvent(new CustomEvent("vv:cloud-sync"));
      if(cloudLocalBackupPending) emitCloudReadyStatus();
      return result.result;
    }catch(err){
      emitCloudStatus(classifyCloudError(err, "write"), err);
      console.error("No se pudo completar la operación en Firestore:", err);
      throw err;
    }
  }

  function mergeRecords(existing, incoming){
    const result = Array.isArray(existing) ? [...existing] : [];
    const positions = new Map();
    const legacyCounts = new Map();
    result.forEach((item, index) => {
      if(item && item.id) positions.set(item.id, index);
      else{
        const key = JSON.stringify(item);
        legacyCounts.set(key, (legacyCounts.get(key) || 0) + 1);
      }
    });
    const seenLegacy = new Map();
    (Array.isArray(incoming) ? incoming : []).forEach(item => {
      if(item && item.id){
        if(positions.has(item.id)){
          const index = positions.get(item.id);
          result[index] = { ...result[index], ...item };
        }
        else{
          positions.set(item.id, result.length);
          result.push(item);
        }
        return;
      }
      const key = JSON.stringify(item);
      const seen = (seenLegacy.get(key) || 0) + 1;
      seenLegacy.set(key, seen);
      if(seen > (legacyCounts.get(key) || 0)) result.push(item);
    });
    return result;
  }

  function requireKnownRemoteRecords(incoming, remoteRecords, label){
    if(!Array.isArray(incoming)) throw new TypeError("La lista de " + label + " debe ser un arreglo.");
    const remoteIds = new Set();
    const legacyCounts = new Map();
    (Array.isArray(remoteRecords) ? remoteRecords : []).forEach(item => {
      if(item && item.id) remoteIds.add(item.id);
      else{
        const key = JSON.stringify(item);
        legacyCounts.set(key, (legacyCounts.get(key) || 0) + 1);
      }
    });
    const incomingLegacyCounts = new Map();
    incoming.forEach(item => {
      if(item && item.id){
        if(!remoteIds.has(item.id)){
          throw new Error("No se guardó la lista de " + label + ": contiene registros que no están confirmados en Firestore. Usa la operación individual correspondiente.");
        }
        return;
      }
      const key = JSON.stringify(item);
      const count = (incomingLegacyCounts.get(key) || 0) + 1;
      incomingLegacyCounts.set(key, count);
      if(count > (legacyCounts.get(key) || 0)){
        throw new Error("No se guardó la lista de " + label + ": contiene registros sin ID que no están confirmados en Firestore.");
      }
    });
  }

  function removeArchivedRecords(records, archivedRecords){
    const archivedIds = new Set();
    const legacyCounts = new Map();
    archivedRecords.forEach(item => {
      if(item && item.id) archivedIds.add(item.id);
      else{
        const key = JSON.stringify(item);
        legacyCounts.set(key, (legacyCounts.get(key) || 0) + 1);
      }
    });
    return records.filter(item => {
      if(item && item.id) return !archivedIds.has(item.id);
      const key = JSON.stringify(item);
      const count = legacyCounts.get(key) || 0;
      if(!count) return true;
      legacyCounts.set(key, count - 1);
      return false;
    });
  }

  /* ---------- Ventas del día / archivo mensual ---------- */
  function loadDay(){
    const openDay = getOpenDay();
    const stored = cloudState && cloudState.vv_day_sales || { items: [] };
    const items = Array.isArray(stored.items) ? stored.items : [];
    return { date: openDay.businessDate, dayId: openDay.id, items: items.filter(item => item.dayId === openDay.id) };
  }
  function saveDay(day){
    return transactCloud(state => {
      const current = state.vv_day_sales || { items: [] };
      requireKnownRemoteRecords(day.items, current.items, "ventas del turno");
      const merged = {
        ...current,
        ...day,
        items: mergeRecords(current.items, day.items)
      };
      return { state: { ...state, vv_day_sales: merged }, result: merged, changed: true };
    });
  }

  function loadArchive(){
    const archive = cloudState && cloudState.vv_archive;
    return Array.isArray(archive) ? archive : [];
  }
  function getOpenDaySales(){
    const dayId = getOpenDay().id;
    return loadArchive().filter(item => item.dayId === dayId).concat(loadDay().items);
  }
  function saveArchive(arr){
    return transactCloud(state => {
      requireKnownRemoteRecords(arr, state.vv_archive, "ventas archivadas");
      const merged = mergeRecords(state.vv_archive, arr);
      return { state: { ...state, vv_archive: merged }, result: merged, changed: true };
    });
  }

  function archiveItems(date, items){
    return transactCloud(state => {
      const currentDay = state.vv_day_sales || { items: [] };
      requireKnownRemoteRecords(items, (state.vv_archive || []).concat(
        Array.isArray(currentDay.items) ? currentDay.items : []
      ), "ventas para archivar");
      const archive = mergeRecords(state.vv_archive, items.map(item => ({
        ...item, date: item.businessDate || date
      })));
      const day = { ...currentDay, items: removeArchivedRecords(currentDay.items || [], items) };
      return { state: { ...state, vv_archive: archive, vv_day_sales: day }, result: archive, changed: true };
    });
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
    return transactCloud(state => {
      const n = (parseInt(state.vv_invoice_seq, 10) || 0) + 1;
      const next = { ...state, vv_invoice_seq: n };
      return { state: next, result: "FS/" + year + "/" + String(n).padStart(4, "0"), changed: true };
    });
  }

  /* ---------- Registrar una venta cobrada (líneas del carrito) ---------- */
  async function registerSale(cartLines, paymentMethod, existingOperationId, originalDayId){
    if(paymentMethod !== "cash" && paymentMethod !== "card"){
      throw new TypeError("El método de pago debe ser cash o card.");
    }
    requireCloudReady();
    const lines = cartLines.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.qty }));
    const expectedDayId = originalDayId || getOpenDay().id;
    const payload = { lines, paymentMethod, dayId: expectedDayId };
    const operationId = existingOperationId || persistPendingOperation("sale", payload);
    const now = new Date();
    const hora = now.toLocaleTimeString("es-CR", {
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    });
    try{
      const invoiceNumber = await transactCloud(state => {
        const existing = (state.vv_day_sales.items || []).find(item => item.operationId === operationId)
          || (state.vv_archive || []).find(item => item.operationId === operationId);
        if(existing) return { state, result: existing.invoiceNumber, changed: false };
        if(state.vv_openDay.id !== expectedDayId){
          throw new Error("El turno cambió en otro dispositivo. La venta no se movió a un turno distinto.");
        }
        const openDay = state.vv_openDay;
        const sequence = (parseInt(state.vv_invoice_seq, 10) || 0) + 1;
        const invoice = "FS/" + businessYear() + "/" + String(sequence).padStart(4, "0");
        const currentDay = state.vv_day_sales && typeof state.vv_day_sales === "object"
          ? state.vv_day_sales : { date: openDay.businessDate, dayId: openDay.id, items: [] };
        const currentItems = Array.isArray(currentDay.items) ? [...currentDay.items] : [];
        lines.forEach((item, index) => currentItems.push({
          id: operationId + "-" + index, operationId, invoiceNumber: invoice,
          time: hora, ts: now.getTime(), createdAt: now.toISOString(), dayId: openDay.id,
          businessDate: openDay.businessDate, paymentMethod,
          product: item.name, qty: item.qty, unit: item.price, total: item.qty * item.price
        }));
        const next = {
          ...state,
          vv_day_sales: { date: openDay.businessDate, dayId: openDay.id, items: currentItems },
          vv_invoice_seq: sequence
        };
        return { state: next, result: invoice, changed: true };
      });
      clearPendingOperation("sale", payload);
      emitCloudReadyStatus();
      return invoiceNumber;
    }catch(err){
      throw err;
    }
  }

  /* ---------- Gastos / compras de insumos (independiente de las ventas) ---------- */
  function loadExpenseDay(){
    const openDay = getOpenDay();
    const stored = cloudState && cloudState.vv_expense_day || {};
    const items = Array.isArray(stored.items) ? stored.items : [];
    return { date: openDay.businessDate, dayId: openDay.id, items: items.filter(item => item.dayId === openDay.id) };
  }
  function saveExpenseDay(day){
    return transactCloud(state => {
      const current = state.vv_expense_day || { items: [] };
      requireKnownRemoteRecords(day.items, current.items, "gastos del turno");
      const merged = { ...current, ...day, items: mergeRecords(current.items, day.items) };
      return { state: { ...state, vv_expense_day: merged }, result: merged, changed: true };
    });
  }

  function loadExpenseArchive(){
    const archive = cloudState && cloudState.vv_expense_archive;
    return Array.isArray(archive) ? archive : [];
  }
  function getOpenDayExpenses(){
    const dayId = getOpenDay().id;
    return loadExpenseArchive().filter(item => item.dayId === dayId).concat(loadExpenseDay().items);
  }
  function saveExpenseArchive(arr){
    return transactCloud(state => {
      requireKnownRemoteRecords(arr, state.vv_expense_archive, "gastos archivados");
      const merged = mergeRecords(state.vv_expense_archive, arr);
      return { state: { ...state, vv_expense_archive: merged }, result: merged, changed: true };
    });
  }

  function archiveExpenseItems(date, items){
    return transactCloud(state => {
      const currentDay = state.vv_expense_day || { items: [] };
      requireKnownRemoteRecords(items, (state.vv_expense_archive || []).concat(
        Array.isArray(currentDay.items) ? currentDay.items : []
      ), "gastos para archivar");
      const archive = mergeRecords(state.vv_expense_archive, items.map(item => ({
        ...item, date: item.businessDate || date
      })));
      const day = { ...currentDay, items: removeArchivedRecords(currentDay.items || [], items) };
      return { state: { ...state, vv_expense_archive: archive, vv_expense_day: day }, result: archive, changed: true };
    });
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

  async function registerExpense(lines, existingOperationId, originalDayId){
    requireCloudReady();
    const normalizedLines = lines.map(item => ({ name: item.name, qty: item.qty, price: item.price }));
    const expectedDayId = originalDayId || getOpenDay().id;
    const payload = { lines: normalizedLines, dayId: expectedDayId };
    const operationId = existingOperationId || persistPendingOperation("expense", payload);
    const now = new Date();
    const hora = now.toLocaleTimeString("es-CR", {
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    });
    const result = await transactCloud(state => {
      if((state.vv_expense_day.items || []).some(item => item.operationId === operationId)
        || (state.vv_expense_archive || []).some(item => item.operationId === operationId)){
        return { state, result: state.vv_expense_day, changed: false };
      }
      if(state.vv_openDay.id !== expectedDayId){
        throw new Error("El turno cambió en otro dispositivo. El gasto no se movió a un turno distinto.");
      }
      const openDay = state.vv_openDay;
      const currentDay = state.vv_expense_day && typeof state.vv_expense_day === "object"
        ? state.vv_expense_day : { date: openDay.businessDate, dayId: openDay.id, items: [] };
      const items = Array.isArray(currentDay.items) ? [...currentDay.items] : [];
      normalizedLines.forEach((item, index) => items.push({
        id: operationId + "-" + index, operationId,
        time: hora, ts: now.getTime(), dayId: openDay.id, businessDate: openDay.businessDate,
        product: item.name, qty: item.qty, unit: item.price, total: item.qty * item.price
      }));
      const nextDay = { date: openDay.businessDate, dayId: openDay.id, items };
      return { state: { ...state, vv_expense_day: nextDay }, result: nextDay, changed: true };
    });
    clearPendingOperation("expense", payload);
    emitCloudReadyStatus();
    return result;
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
    return null;
  }

  function loadClosures(){
    const closures = cloudState && cloudState.vv_closures;
    return Array.isArray(closures) ? closures : [];
  }

  async function closeOpenDay(expectedDayId){
    requireCloudReady();
    const dayId = expectedDayId || getOpenDay().id;
    const closedAt = Date.now();
    return transactCloud(state => {
      if(state.vv_openDay.id !== dayId){
        throw new Error("El turno cambió en otro dispositivo. Actualiza la pantalla antes de cerrar.");
      }
      const closures = Array.isArray(state.vv_closures) ? [...state.vv_closures] : [];
      const alreadyClosed = closures.find(item => item.dayId === dayId);
      if(alreadyClosed) return { state, result: alreadyClosed, changed: false };
      const daySales = state.vv_day_sales && Array.isArray(state.vv_day_sales.items)
        ? state.vv_day_sales.items.filter(item => item.dayId === dayId) : [];
      const dayExpenses = state.vv_expense_day && Array.isArray(state.vv_expense_day.items)
        ? state.vv_expense_day.items.filter(item => item.dayId === dayId) : [];
      const sales = (state.vv_archive || []).filter(item => item.dayId === dayId).concat(daySales);
      const expenses = (state.vv_expense_archive || []).filter(item => item.dayId === dayId).concat(dayExpenses);
      const totalSales = sales.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
      const totalExpenses = expenses.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
      const closure = {
        dayId, businessDate: state.vv_openDay.businessDate, openedAt: state.vv_openDay.openedAt,
        closedAt, totalSales, totalExpenses, net: totalSales - totalExpenses,
        dishes: sales.reduce((sum, item) => sum + (Number(item.qty) || 0), 0)
      };
      const archiveIds = new Set((state.vv_archive || []).map(item => item.id).filter(Boolean));
      const expenseArchiveIds = new Set((state.vv_expense_archive || []).map(item => item.id).filter(Boolean));
      const archivedSales = [...(state.vv_archive || [])];
      daySales.forEach(item => {
        if(!item.id || !archiveIds.has(item.id)){
          archivedSales.push({ ...item, date: item.businessDate || state.vv_openDay.businessDate });
          if(item.id) archiveIds.add(item.id);
        }
      });
      const archivedExpenses = [...(state.vv_expense_archive || [])];
      dayExpenses.forEach(item => {
        if(!item.id || !expenseArchiveIds.has(item.id)){
          archivedExpenses.push({ ...item, date: item.businessDate || state.vv_openDay.businessDate });
          if(item.id) expenseArchiveIds.add(item.id);
        }
      });
      const nextOpenDay = createOpenDay(closedAt);
      closures.push(closure);
      const next = {
        ...state,
        vv_archive: archivedSales,
        vv_expense_archive: archivedExpenses,
        vv_day_sales: {
          date: state.vv_openDay.businessDate, dayId,
          items: (state.vv_day_sales.items || []).filter(item => item.dayId !== dayId)
        },
        vv_expense_day: {
          date: state.vv_openDay.businessDate, dayId,
          items: (state.vv_expense_day.items || []).filter(item => item.dayId !== dayId)
        },
        vv_closures: closures,
        vv_openDay: nextOpenDay
      };
      return { state: next, result: closure, changed: true };
    });
  }

  return {
    NEGOCIO, PRODUCTS, CATEGORIES, SUPPLIES, CRC, escapeHtml,
    getProducts(){
      if(!cloudRemoteExists || !cloudState || !Array.isArray(cloudState.vv_products)) return [];
      return cloudState.vv_products.map(product => product.id === SODA_PRODUCT_ID
        ? { ...product, price: SODA_PRICE, displayPrice: CRC(SODA_PRICE) }
        : product);
    },
    getSupplies(){ return cloudRemoteExists && cloudState && Array.isArray(cloudState.vv_supplies) ? cloudState.vv_supplies : []; },
    todayKey, monthKey, getOpenDay,
    loadDay, saveDay, loadArchive, saveArchive, archiveItems, getMonthRows, getOpenDaySales,
    nextInvoiceNumber, registerSale,
    loadExpenseDay, saveExpenseDay, loadExpenseArchive, saveExpenseArchive,
    archiveExpenseItems, getExpenseMonthRows, registerExpense, getOpenDayExpenses, loadClosures, closeOpenDay,
    AUTH, initCloud, disposeCloud, retryCloud, resolveCloudConflict, retryPendingOperations,
    isCloudConfigured, isCloudReady, hasCloudSnapshot(){ return cloudRemoteExists && !!cloudState; }, getCloudStatus
  };
})();
