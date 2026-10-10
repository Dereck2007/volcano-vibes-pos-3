(function(){
  "use strict";
  const { NEGOCIO, PRODUCTS, CATEGORIES, CRC, registerSale, nextInvoiceNumber } = window.VV;

  let activeCat = "todos";
  let cart = []; // { id, name, price, qty }

  /* ---------- Categorías ---------- */
  const catTabs = document.getElementById("catTabs");
  CATEGORIES.forEach(c => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab" + (c.id === "todos" ? " tab--active" : "");
    btn.textContent = c.label;
    btn.dataset.cat = c.id;
    btn.addEventListener("click", () => {
      activeCat = c.id;
      [...catTabs.children].forEach(b => b.classList.toggle("tab--active", b === btn));
      renderGrid();
    });
    catTabs.appendChild(btn);
  });

  /* ---------- Grid de productos ---------- */
  const productGrid = document.getElementById("productGrid");
  function renderGrid(){
    productGrid.innerHTML = "";
    const list = activeCat === "todos" ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCat);
    list.forEach(p => {
      const card = document.createElement("article");
      card.className = "product-card";
      const priceText = p.displayPrice || CRC(p.price);
      card.innerHTML = `
        <div class="product-card__body">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
        </div>
        <div class="product-card__foot">
          <span class="product-card__price">${priceText}</span>
          <button type="button" class="product-card__add" aria-label="Agregar ${p.name}">+</button>
        </div>`;
      card.querySelector(".product-card__add").addEventListener("click", () => addToCart(p));
      productGrid.appendChild(card);
    });
  }
  renderGrid();

  /* ---------- Carrito ---------- */
  const cartList = document.getElementById("cartList");
  const emptyCart = document.getElementById("emptyCart");

  function addToCart(p){
    const existing = cart.find(i => i.id === p.id);
    if(existing){ existing.qty += 1; }
    else{ cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 }); }
    renderCart();
  }
  function changeQty(id, delta){
    const item = cart.find(i => i.id === id);
    if(!item) return;
    item.qty += delta;
    if(item.qty <= 0){ cart = cart.filter(i => i.id !== id); }
    renderCart();
  }
  function removeItem(id){
    cart = cart.filter(i => i.id !== id);
    renderCart();
  }

  /* Sin IVA: el subtotal es igual al total y no se calcula ningún impuesto. */
  function totals(){
    const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
    return { subtotal: total, iva: 0, total };
  }

  function renderCart(){
    cartList.innerHTML = "";
    emptyCart.style.display = cart.length ? "none" : "block";
    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <div class="cart-row__info">
          <span class="cart-row__name">${item.name}</span>
          <span class="cart-row__unit">${CRC(item.price)} c/u</span>
        </div>
        <div class="cart-row__qty">
          <button type="button" data-act="minus">&minus;</button>
          <span>${item.qty}</span>
          <button type="button" data-act="plus">+</button>
        </div>
        <div class="cart-row__total">${CRC(item.price * item.qty)}</div>
        <button type="button" class="cart-row__del" aria-label="Quitar">&times;</button>`;
      row.querySelector('[data-act="minus"]').addEventListener("click", () => changeQty(item.id, -1));
      row.querySelector('[data-act="plus"]').addEventListener("click", () => changeQty(item.id, 1));
      row.querySelector(".cart-row__del").addEventListener("click", () => removeItem(item.id));
      cartList.appendChild(row);
    });
    document.getElementById("sumTotal").textContent = CRC(totals().total);
  }

  document.getElementById("btnLimpiar").addEventListener("click", () => {
    if(cart.length === 0) return;
    cart = [];
    renderCart();
  });

  /* ---------- Modal de cobro ---------- */
  const payOverlay = document.getElementById("payOverlay");
  const modalTotal = document.getElementById("modalTotal");

  document.getElementById("btnCobrar").addEventListener("click", () => {
    if(cart.length === 0){ toast("Agrega al menos un producto a la orden."); return; }
    modalTotal.textContent = CRC(totals().total);
    payOverlay.hidden = false;
  });

  /* Cobro directo: registra la venta de inmediato (efectivo o tarjeta) y limpia el carrito. */
  function cobrar(method){
    if(cart.length === 0) return;
    const { subtotal, iva, total } = totals();

    fillTicket({ subtotal, iva, total, cash: total, change: 0 });
    registerSale(cart, method);

    payOverlay.hidden = true;
    cart = [];
    renderCart();
    toast(method === "cash"
      ? "Venta cobrada en efectivo correctamente \u2713"
      : "Venta cobrada con tarjeta correctamente \u2713");
  }

  document.getElementById("btnPayCash").addEventListener("click", () => cobrar("cash"));
  document.getElementById("btnPayCard").addEventListener("click", () => cobrar("card"));

  document.getElementById("btnCancelPayMethod").addEventListener("click", () => {
    payOverlay.hidden = true;
  });
  payOverlay.addEventListener("click", e => { if(e.target === payOverlay) payOverlay.hidden = true; });

  /* ---------- Plantilla de factura simple ---------- */
  function fillTicket({ subtotal, iva, total, cash, change }){
    const now = new Date();
    document.getElementById("tkNombre").textContent = NEGOCIO.nombre;
    document.getElementById("tkFecha").textContent = now.toLocaleDateString("es-CR", {
      day: "2-digit", month: "2-digit", year: "numeric"
    }) + " " + now.toLocaleTimeString("es-CR", {
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    });
    document.getElementById("tkNumero").textContent = "FACTURA SIMPLIFICADA: " + nextInvoiceNumber();
    document.getElementById("tkCedula").textContent = NEGOCIO.cedula;
    document.getElementById("tkTelefono").textContent = NEGOCIO.telefono;

    const itemsBody = document.getElementById("tkItems");
    itemsBody.innerHTML = "";
    cart.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${item.qty}x ${item.name}</td><td class="num">${CRC(item.price * item.qty)}</td>`;
      itemsBody.appendChild(tr);
    });

    document.getElementById("tkSubtotal").textContent = CRC(subtotal);
    document.getElementById("tkIva").textContent = CRC(iva);
    document.getElementById("tkTotal").textContent = CRC(total);
    document.getElementById("tkEfectivo").textContent = CRC(cash);
    document.getElementById("tkCambio").textContent = CRC(change);
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg){
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("toast--show"), 2200);
  }

  /* ---------- Estado siempre limpio al entrar a la pantalla ----------
     Si el navegador restaura la página desde su caché (bfcache) al navegar
     con atrás/adelante, el JS no se re-ejecuta y el modal podría quedar
     abierto tal como estaba. Esto garantiza que la pantalla siempre
     arranca en blanco: sin carrito y sin el modal de cobro abierto. */
  function resetScreen(){
    payOverlay.hidden = true;
    cart = [];
    renderCart();
  }
  window.addEventListener("pageshow", resetScreen);
  resetScreen();
})();
