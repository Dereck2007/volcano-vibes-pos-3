(function(){
  "use strict";
  const {
    SUPPLIES, CRC, todayKey,
    loadExpenseDay, saveExpenseDay, archiveExpenseItems, getExpenseMonthRows, registerExpense
  } = window.VV;

  let cart = []; // { name, qty, price }
  let day = loadExpenseDay();

  /* ---------- Grid de insumos frecuentes ---------- */
  const supplyGrid = document.getElementById("supplyGrid");
  SUPPLIES.forEach(s => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "product-card product-card--supply";
    card.innerHTML = `<span class="product-card__supply-name">${s.name}</span><span class="product-card__add">+</span>`;
    card.addEventListener("click", () => addToCart(s.name, 1, 0));
    supplyGrid.appendChild(card);
  });

  /* ---------- Carrito de la compra actual ---------- */
  const cartList = document.getElementById("cartList");
  const emptyCart = document.getElementById("emptyCart");

  function addToCart(name, qty, price){
    cart.push({ name, qty, price });
    renderCart();
  }

  function renderCart(){
    cartList.innerHTML = "";
    emptyCart.style.display = cart.length ? "none" : "block";
    cart.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "cart-row cart-row--editable";
      row.innerHTML = `
        <div class="cart-row__info">
          <span class="cart-row__name">${item.name}</span>
        </div>
        <div class="cart-row__qty">
          <input type="number" class="expense-input expense-input--qty" min="1" value="${item.qty}" aria-label="Cantidad">
        </div>
        <div class="cart-row__price">
          <input type="number" class="expense-input expense-input--price" min="0" step="1" placeholder="Precio &#8353;" value="${item.price > 0 ? item.price : ""}" aria-label="Precio">
        </div>
        <div class="cart-row__total">${CRC(item.qty * item.price)}</div>
        <button type="button" class="cart-row__del" aria-label="Quitar">&times;</button>`;

      const qtyInput = row.querySelector(".expense-input--qty");
      const priceInput = row.querySelector(".expense-input--price");
      const totalEl = row.querySelector(".cart-row__total");

      // Solo actualiza el número y el total de esta fila: nunca reconstruye
      // los inputs mientras se escribe, para no perder el foco ni el cursor.
      qtyInput.addEventListener("input", () => {
        const v = parseInt(qtyInput.value, 10);
        item.qty = v > 0 ? v : 1;
        totalEl.textContent = CRC(item.qty * item.price);
        updateGrandTotal();
      });
      priceInput.addEventListener("input", () => {
        const v = parseFloat(priceInput.value);
        item.price = v >= 0 ? v : 0;
        totalEl.textContent = CRC(item.qty * item.price);
        updateGrandTotal();
      });
      row.querySelector(".cart-row__del").addEventListener("click", () => {
        cart.splice(idx, 1);
        renderCart();
      });
      cartList.appendChild(row);
    });
    updateGrandTotal();
  }

  function updateGrandTotal(){
    const total = cart.reduce((s,i) => s + i.qty * i.price, 0);
    document.getElementById("sumTotal").textContent = CRC(total);
  }

  document.getElementById("customForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("customName").value.trim();
    const qty = parseInt(document.getElementById("customQty").value, 10);
    const price = parseFloat(document.getElementById("customPrice").value);
    if(!name || !qty || isNaN(price) || price < 0) return;
    addToCart(name, qty, price);
    e.target.reset();
    document.getElementById("customQty").value = 1;
    document.getElementById("customName").focus();
  });

  document.getElementById("btnLimpiar").addEventListener("click", () => {
    if(cart.length === 0) return;
    cart = [];
    renderCart();
  });

  document.getElementById("btnRegistrar").addEventListener("click", () => {
    if(cart.length === 0){ toast("Agrega al menos un producto a la compra."); return; }
    const sinPrecio = cart.some(i => !i.price || i.price <= 0);
    if(sinPrecio){ toast("Falta digitar el precio de uno o más productos."); return; }

    registerExpense(cart);
    cart = [];
    renderCart();
    renderReport();
    toast("Gasto registrado \u2713");
  });

  /* ---------- Tabs del reporte ---------- */
  const tabDay = document.getElementById("tabDay");
  const tabMonth = document.getElementById("tabMonth");
  const panelDay = document.getElementById("panelTablaDia");
  const panelMonth = document.getElementById("panelHistorico");
  let activeTab = "day";

  function setTab(tab){
    activeTab = tab;
    tabDay.classList.toggle("tab--active", tab === "day");
    tabMonth.classList.toggle("tab--active", tab === "month");
    tabDay.setAttribute("aria-selected", tab === "day");
    tabMonth.setAttribute("aria-selected", tab === "month");
    panelDay.style.display = tab === "day" ? "" : "none";
    panelMonth.style.display = tab === "month" ? "" : "none";
  }
  tabDay.addEventListener("click", () => setTab("day"));
  tabMonth.addEventListener("click", () => setTab("month"));

  /* ---------- Reporte de gastos ---------- */
  function renderReport(){
    day = loadExpenseDay();
    const gastosHoy = day.items.reduce((s,i) => s + i.total, 0);
    const comprasHoy = day.items.reduce((s,i) => s + i.qty, 0);
    const monthRows = getExpenseMonthRows(day);
    const totalMes = monthRows.reduce((s,r) => s + r.total, 0);

    document.getElementById("statGastosHoy").textContent = CRC(gastosHoy);
    document.getElementById("statComprasHoy").textContent = comprasHoy;
    document.getElementById("statTotalMes").textContent = CRC(totalMes);

    const dayBody = document.querySelector("#tableDay tbody");
    dayBody.innerHTML = "";
    document.getElementById("emptyDay").style.display = day.items.length ? "none" : "block";
    [...day.items].reverse().forEach(it => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${it.time}</td><td>${it.product}</td><td class="num">${it.qty}</td><td class="num money">${CRC(it.total)}</td>`;
      dayBody.appendChild(tr);
    });

    const monthBody = document.querySelector("#tableMonth tbody");
    monthBody.innerHTML = "";
    document.getElementById("emptyMonth").style.display = monthRows.length ? "none" : "block";
    monthRows.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${r.product}</td><td class="num">${r.qty}</td><td class="num money">${CRC(r.total)}</td>`;
      monthBody.appendChild(tr);
    });
  }

  /* ---------- Cerrar día ---------- */
  document.getElementById("btnReset").addEventListener("click", () => {
    if(day.items.length === 0){ toast("No hay gastos de hoy para cerrar."); return; }
    const ok = confirm("Esto cerrará el día actual: los gastos de hoy pasan al consolidado mensual y la lista de hoy queda en cero. ¿Continuar?");
    if(!ok) return;
    archiveExpenseItems(day.date, day.items);
    day = { date: todayKey(), items: [] };
    saveExpenseDay(day);
    renderReport();
    toast("Día cerrado y enviado al consolidado mensual.");
  });

  /* ---------- Exportar PDF ---------- */
  document.getElementById("btnPdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Volcano Vibes - Gastos", 14, 18);
    doc.setFontSize(10);
    doc.text(new Date().toLocaleString("es-CR", { timeZone: "America/Costa_Rica" }), 14, 25);

    const rows = activeTab === "day"
      ? day.items.map(i => [i.time, i.product, String(i.qty), CRC(i.total)])
      : getExpenseMonthRows(day).map(r => [r.product, String(r.qty), CRC(r.total)]);
    const head = activeTab === "day"
      ? [["Hora","Producto","Cant.","Total"]]
      : [["Producto","Cant.","Total acumulado"]];

    doc.autoTable({ head, body: rows, startY: 32, styles: { fontSize: 9 }, headStyles: { fillColor: [230,57,70] } });

    const finalY = doc.lastAutoTable.finalY || 32;
    const totalGeneral = activeTab === "day"
      ? day.items.reduce((s,i)=>s+i.total,0)
      : getExpenseMonthRows(day).reduce((s,r)=>s+r.total,0);
    doc.setFontSize(11);
    doc.text(`Total: ${CRC(totalGeneral)}`, 14, finalY + 10);

    doc.save(`volcano-vibes-gastos-${activeTab === "day" ? "dia" : "mes"}-${todayKey()}.pdf`);
  });

  /* ---------- Exportar Excel ---------- */
  document.getElementById("btnXlsx").addEventListener("click", () => {
    const rows = activeTab === "day"
      ? day.items.map(i => ({ Hora: i.time, Producto: i.product, Cantidad: i.qty, Total: i.total }))
      : getExpenseMonthRows(day).map(r => ({ Producto: r.product, Cantidad: r.qty, "Total acumulado": r.total }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab === "day" ? "Gastos del dia" : "Consolidado mes");
    XLSX.writeFile(wb, `volcano-vibes-gastos-${activeTab === "day" ? "dia" : "mes"}-${todayKey()}.xlsx`);
  });

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg){
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("toast--show"), 2200);
  }

  /* ---------- Estado limpio al entrar (igual que en Punto de venta) ---------- */
  function resetScreen(){
    cart = [];
    renderCart();
  }
  window.addEventListener("pageshow", resetScreen);

  /* ---------- Init ---------- */
  setTab("day");
  renderCart();
  renderReport();
  window.addEventListener("vv:cloud-sync", renderReport);
})();
