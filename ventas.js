(function(){
  "use strict";
  const {
    CRC, monthKey, getOpenDay, loadDay, getMonthRows, getOpenDaySales,
    loadExpenseDay, getExpenseMonthRows, getOpenDayExpenses, closeOpenDay
  } = window.VV;

  let day = loadDay();

  /* ---------- Reloj ---------- */
  function tickClock(){
    const now = new Date();
    const fecha = now.toLocaleDateString("es-CR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const hora = now.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
    document.getElementById("clockNow").textContent = fecha + " " + hora;
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------- Tabs ---------- */
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

  /* ---------- Ventas + gastos = ganancia neta (hoy y mes) ---------- */
  function getFinancials(){
    const ventasHoy = getTodaySales().reduce((s,i) => s + i.total, 0);
    const ventasMes = getMonthRows(day).reduce((s,r) => s + r.total, 0);

    const expenseDay = loadExpenseDay();
    const gastosHoy = getOpenDayExpenses().reduce((s,i) => s + i.total, 0);
    const gastosMes = getExpenseMonthRows(expenseDay).reduce((s,r) => s + r.total, 0);

    return {
      ventasHoy, gastosHoy, gananciaHoy: ventasHoy - gastosHoy,
      ventasMes, gastosMes, gananciaMes: ventasMes - gastosMes
    };
  }

  function getTodaySales(){
    return getOpenDaySales();
  }

  function getReportContext(){
    const now = new Date();
    const openDay = getOpenDay();
    const month = monthKey(openDay.businessDate);
    const monthSales = loadArchive()
      .filter(item => item.businessDate && monthKey(item.businessDate) === month)
      .concat(day.items);
    const sumPayments = sales => sales.reduce((totals, sale) => {
      const method = String(sale.paymentMethod || "").toLowerCase();
      const key = method === "cash" || method === "efectivo"
        ? "cash"
        : method === "card" || method === "tarjeta" ? "card" : "unclassified";
      totals[key] += Number(sale.total) || 0;
      return totals;
    }, { cash: 0, card: 0, unclassified: 0 });
    const hour = Number(new Intl.DateTimeFormat("en-US", {
      hour: "2-digit", hourCycle: "h23"
    }).format(now));

    return {
      date: new Date(openDay.businessDate + "T00:00:00").toLocaleDateString("es-CR", { day: "2-digit", month: "2-digit", year: "numeric" }),
      time: now.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      shift: hour >= 5 && hour < 12 ? "Mañana" : hour < 18 && hour >= 12 ? "Tarde" : "Noche",
      cashier: window.VV.AUTH.currentUser(),
      payments: {
        day: sumPayments(getTodaySales()),
        month: sumPayments(monthSales)
      }
    };
  }

  function paintProfit(f){
    document.getElementById("pfVentasHoy").textContent = CRC(f.ventasHoy);
    document.getElementById("pfGastosHoy").textContent = CRC(f.gastosHoy);
    const netHoyEl = document.getElementById("pfGananciaHoy");
    netHoyEl.textContent = CRC(f.gananciaHoy);
    netHoyEl.closest(".profit-row").classList.toggle("profit-row--negative", f.gananciaHoy < 0);

    document.getElementById("pfVentasMes").textContent = CRC(f.ventasMes);
    document.getElementById("pfGastosMes").textContent = CRC(f.gastosMes);
    const netMesEl = document.getElementById("pfGananciaMes");
    netMesEl.textContent = CRC(f.gananciaMes);
    netMesEl.closest(".profit-row").classList.toggle("profit-row--negative", f.gananciaMes < 0);
  }

  /* ---------- Render ---------- */
  function renderAll(){
    day = loadDay();
    const openDay = getOpenDay();
    document.getElementById("openDayInfo").textContent = "Turno abierto desde " + new Date(openDay.openedAt).toLocaleString("es-CR");
    const todaySales = getTodaySales();
    const ventasHoy = todaySales.reduce((s,i) => s + i.total, 0);
    const platosHoy = todaySales.reduce((s,i) => s + i.qty, 0);
    const monthRows = getMonthRows(day);
    const totalMes = monthRows.reduce((s,r) => s + r.total, 0);

    document.getElementById("statVentasHoy").textContent = CRC(ventasHoy);
    document.getElementById("statPlatosHoy").textContent = platosHoy;
    document.getElementById("statTotalMes").textContent = CRC(totalMes);

    paintProfit(getFinancials());

    const dayBody = document.querySelector("#tableDay tbody");
    dayBody.innerHTML = "";
    document.getElementById("emptyDay").style.display = todaySales.length ? "none" : "block";
    [...todaySales].reverse().forEach(it => {
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

  /* ---------- Cierre del día ---------- */
  document.getElementById("btnReset").addEventListener("click", () => {
    const ok = confirm("¿Cerrar el día? Las cifras de hoy volverán a ₡0. Lo registrado queda guardado.");
    if(!ok) return;
    closeOpenDay();
    renderAll();
    toast("Día cerrado correctamente.");
  });

  /* ---------- Exportar PDF ---------- */
  document.getElementById("btnPdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const f = getFinancials();
    const ventasHoy = f.ventasHoy;
    const gastosHoy = f.gastosHoy;
    const ventasMes = f.ventasMes;
    const gastosMes = f.gastosMes;
    const gananciaMes = f.gananciaMes;
    const report = getReportContext();
    const salesToday = getTodaySales();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const left = 18;
    const right = pageWidth - 18;
    const innerWidth = right - left;

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setTextColor(15, 20, 24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(25);
    doc.text("Volcano Vibes", left, 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(60, 60, 60);
    doc.text("Comidas Rápidas • Reporte Ejecutivo POS", left, 33);

    const infoX = 126;
    const infoY = 11;
    const infoW = 68;
    const infoH = 28;
    doc.setFillColor(244, 244, 246);
    doc.roundedRect(infoX, infoY, infoW, infoH, 1.5, 1.5, "F");
    doc.setDrawColor(180, 180, 180);
    doc.roundedRect(infoX, infoY, infoW, infoH, 1.5, 1.5, "S");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(52, 52, 52);
    doc.text(`Fecha: ${report.date}`, infoX + 5, infoY + 7);
    doc.text(`Hora: ${report.time} (Costa Rica)`, infoX + 5, infoY + 13);
    doc.text(`Turno: ${report.shift}`, infoX + 5, infoY + 19);
    doc.text(`Cajero: ${report.cashier}`, infoX + 5, infoY + 25);

    doc.setDrawColor(222, 59, 59);
    doc.line(left, 39, right, 39);

    const cardW = (innerWidth - 9) / 2;
    const cardH = 23;
    const row1Y = 47;
    const row2Y = 77;
    const cards = [
      { x: left, y: row1Y, w: cardW, h: cardH, bg: [219, 240, 226], border: [175, 208, 178], label: "VENTAS HOY", value: CRC(ventasHoy) },
      { x: left + cardW + 9, y: row1Y, w: cardW, h: cardH, bg: [246, 228, 232], border: [210, 176, 188], label: "GASTOS HOY", value: CRC(gastosHoy) },
      { x: left, y: row2Y, w: cardW, h: cardH, bg: [224, 236, 250], border: [176, 201, 234], label: "VENTAS DEL MES", value: CRC(ventasMes) },
      { x: left + cardW + 9, y: row2Y, w: cardW, h: cardH, bg: [239, 235, 203], border: [218, 209, 160], label: "GASTOS DEL MES", value: CRC(gastosMes) }
    ];

    cards.forEach(card => {
      doc.setFillColor(card.bg[0], card.bg[1], card.bg[2]);
      doc.roundedRect(card.x, card.y, card.w, card.h, 1.8, 1.8, "F");
      doc.setDrawColor(card.border[0], card.border[1], card.border[2]);
      doc.roundedRect(card.x, card.y, card.w, card.h, 1.8, 1.8, "S");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(48, 48, 48);
      doc.text(card.label, card.x + 6, card.y + 8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(17);
      doc.setTextColor(18, 18, 18);
      doc.text(card.value, card.x + 6, card.y + 18);
    });

    const section1Y = 112;
    doc.setFillColor(22, 35, 52);
    doc.rect(left, section1Y, innerWidth, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text("1. DINERO GENERADO POR PERÍODO", left + 4, section1Y + 6.5);

    const metricY = 126;
    const metricH = 29;
    const singleMetricW = innerWidth;

    doc.setFillColor(214, 244, 224);
    doc.roundedRect(left, metricY, singleMetricW, metricH, 1.8, 1.8, "F");
    doc.setDrawColor(76, 179, 119);
    doc.roundedRect(left, metricY, singleMetricW, metricH, 1.8, 1.8, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(22, 110, 77);
    doc.text("Efectivo en Caja", left + 8, metricY + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text(`TOTAL EFECTIVO DEL DÍA: ${CRC(report.payments.day.cash)}`, left + 8, metricY + 16);
    doc.text(`TOTAL EFECTIVO DEL MES: ${CRC(report.payments.month.cash)}`, left + 8, metricY + 24);

    const bankY = metricY + 36;
    doc.setFillColor(226, 239, 251);
    doc.roundedRect(left, bankY, singleMetricW, metricH, 1.8, 1.8, "F");
    doc.setDrawColor(99, 145, 224);
    doc.roundedRect(left, bankY, singleMetricW, metricH, 1.8, 1.8, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.2);
    doc.setTextColor(34, 97, 194);
    const bankLabel = doc.splitTextToSize("Transacciones Bancarias / Tarjeta", singleMetricW - 18);
    doc.text(bankLabel, left + 8, bankY + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text(`TOTAL DATÁFONO DEL DÍA: ${CRC(report.payments.day.card)}`, left + 8, bankY + 16);
    doc.text(`TOTAL DATÁFONO DEL MES: ${CRC(report.payments.month.card)}`, left + 8, bankY + 24);

    let section2Y = bankY + 35;
    const unclassifiedDay = report.payments.day.unclassified;
    const unclassifiedMonth = report.payments.month.unclassified;
    if(unclassifiedDay > 0 || unclassifiedMonth > 0){
      const unclassifiedY = bankY + 35;
      doc.setFillColor(246, 239, 222);
      doc.roundedRect(left, unclassifiedY, singleMetricW, 16, 1.8, 1.8, "F");
      doc.setDrawColor(218, 190, 133);
      doc.roundedRect(left, unclassifiedY, singleMetricW, 16, 1.8, 1.8, "S");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(132, 91, 21);
      doc.text(`Sin método registrado · Día: ${CRC(unclassifiedDay)} · Mes: ${CRC(unclassifiedMonth)}`, left + 8, unclassifiedY + 10);
      section2Y = unclassifiedY + 22;
    }
    doc.setFillColor(22, 35, 52);
    doc.rect(left, section2Y, innerWidth, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text("2. RESUMEN DEL MES", left + 4, section2Y + 6.5);

    const summaryBaseY = section2Y + 18;
    const summaryRows = [
      { label: "(+) Ventas Totales del Mes", value: CRC(ventasMes) },
      { label: "(-) Gastos Totales del Mes", value: CRC(gastosMes) },
      { label: "(=) Ganancia Limpia del Mes", value: CRC(gananciaMes) }
    ];

    summaryRows.forEach((row, idx) => {
      const y = summaryBaseY + idx * 14;
      doc.setDrawColor(205, 205, 205);
      doc.line(left, y + 9, right, y + 9);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.8);
      doc.setTextColor(30, 30, 30);
      const labelWidth = right - left - 64;
      const labelLines = doc.splitTextToSize(row.label, labelWidth);
      doc.text(labelLines, left + 4, y + 2);
      doc.text(row.value, right - 4, y + 2, { align: "right" });
    });

    doc.addPage();
    doc.setTextColor(15, 20, 24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Ventas del turno abierto", left, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Fecha de negocio: ${report.date}`, left, 27);
    doc.autoTable({
      head: [["Hora", "Producto", "Cantidad", "Total"]],
      body: salesToday.map(sale => [sale.time || "", sale.product, String(sale.qty), CRC(sale.total)]),
      startY: 34,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [182, 56, 53] },
      didDrawPage: () => {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("Volcano Vibes · Turno abierto", left, pageHeight - 8);
      }
    });

    doc.save(`volcano-vibes-reporte-${activeTab === "day" ? "dia" : "mes"}-${getOpenDay().businessDate}.pdf`);
  });

  /* ---------- Exportar Excel ---------- */
  document.getElementById("btnXlsx").addEventListener("click", () => {
    const f = getFinancials();
    const ventasHoy = f.ventasHoy;
    const gastosHoy = f.gastosHoy;
    const ventasMes = f.ventasMes;
    const gastosMes = f.gastosMes;
    const gananciaMes = f.gananciaMes;
    const report = getReportContext();
    const salesToday = getTodaySales();

    const rows = [
      [window.VV.NEGOCIO.nombre, "", "", ""],
      ["Comidas Rápidas · Reporte Ejecutivo POS", "", "", ""],
      ["Fecha", report.date, "Hora", report.time + " (Costa Rica)"],
      ["Turno", report.shift, "Cajero", report.cashier],
      ["", "", "", ""],
      ["VENTAS HOY", "GASTOS HOY", "VENTAS DEL MES", "GASTOS DEL MES"],
      [ventasHoy, gastosHoy, ventasMes, gastosMes],
      ["", "", "", ""],
      ["1. DINERO GENERADO POR PERÍODO", "", "", ""],
      ["EFECTIVO · HOY", "DATÁFONO · HOY", "EFECTIVO · MES", "DATÁFONO · MES"],
      [report.payments.day.cash, report.payments.day.card, report.payments.month.cash, report.payments.month.card],
      [report.payments.day.unclassified > 0 ? "Ventas sin método · Hoy" : "", report.payments.day.unclassified || "", report.payments.month.unclassified > 0 ? "Ventas sin método · Mes" : "", report.payments.month.unclassified || ""],
      ["", "", "", ""],
      ["2. RESUMEN DEL MES", "", "", ""],
      ["(+) Ventas Totales del Mes", "", "", ventasMes],
      ["(-) Gastos Totales del Mes", "", "", gastosMes],
      ["(=) Ganancia Limpia del Mes", "", "", gananciaMes],
      ["", "", "", ""],
      ["Firma Cajero(a) / Operador", "", "Firma Encargado / Administrador", ""]
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const merges = ["A1:D1", "A2:D2", "A9:D9", "A14:D14", "A15:C15", "A16:C16", "A17:C17", "A19:B19", "C19:D19"];
    ws["!merges"] = merges.map(range => XLSX.utils.decode_range(range));
    ws["!cols"] = [{ wch: 32 }, { wch: 20 }, { wch: 32 }, { wch: 20 }];
    ws["!rows"] = [
      { hpt: 34 }, { hpt: 23 }, { hpt: 22 }, { hpt: 22 }, { hpt: 10 },
      { hpt: 24 }, { hpt: 32 }, { hpt: 10 }, { hpt: 27 }, { hpt: 24 },
      { hpt: 30 }, { hpt: 22 }, { hpt: 10 }, { hpt: 27 }, { hpt: 24 },
      { hpt: 24 }, { hpt: 28 }, { hpt: 12 }, { hpt: 26 }
    ];

    const fill = color => ({ patternType: "solid", fgColor: { rgb: color } });
    const setRangeStyle = (range, style) => {
      const bounds = XLSX.utils.decode_range(range);
      for(let row = bounds.s.r; row <= bounds.e.r; row++){
        for(let col = bounds.s.c; col <= bounds.e.c; col++){
          const address = XLSX.utils.encode_cell({ r: row, c: col });
          if(!ws[address]) ws[address] = { t: "s", v: "" };
          ws[address].s = style;
        }
      }
    };
    const baseStyle = {
      font: { name: "Aptos", sz: 11, color: { rgb: "263445" } },
      alignment: { vertical: "center" }
    };
    const currencyStyle = {
      ...baseStyle,
      font: { name: "Aptos", sz: 12, bold: true, color: { rgb: "162334" } },
      numFmt: '"₡" #,##0',
      alignment: { horizontal: "right", vertical: "center" }
    };

    setRangeStyle("A1:D19", baseStyle);
    setRangeStyle("A1:D1", {
      font: { name: "Aptos Display", sz: 20, bold: true, color: { rgb: "FFFFFF" } },
      fill: fill("162334"),
      alignment: { horizontal: "left", vertical: "center", indent: 1 }
    });
    setRangeStyle("A2:D2", {
      font: { name: "Aptos", sz: 11, color: { rgb: "FFE2CF" } },
      fill: fill("293A4D"),
      alignment: { horizontal: "left", vertical: "center", indent: 1 }
    });
    ["A3", "C3", "A4", "C4"].forEach(cell => {
      setRangeStyle(cell, {
        ...baseStyle,
        font: { name: "Aptos", sz: 10, bold: true, color: { rgb: "526276" } },
        fill: fill("EEF2F6")
      });
    });
    ["B3", "D3", "B4", "D4"].forEach(cell => {
      setRangeStyle(cell, { ...baseStyle, fill: fill("F7F9FB") });
    });

    const kpiColors = ["D9F0E2", "F6E4E8", "E0ECFA", "EFEBCB"];
    ["A6", "B6", "C6", "D6"].forEach((cell, index) => setRangeStyle(cell, {
      font: { name: "Aptos", sz: 10, bold: true, color: { rgb: "263445" } },
      fill: fill(kpiColors[index]),
      alignment: { horizontal: "center", vertical: "center", wrapText: true }
    }));
    ["A7", "B7", "C7", "D7"].forEach((cell, index) => setRangeStyle(cell, {
      ...currencyStyle,
      font: { name: "Aptos Display", sz: 16, bold: true, color: { rgb: "162334" } },
      fill: fill(kpiColors[index]),
      alignment: { horizontal: "center", vertical: "center" }
    }));

    const sectionStyle = {
      font: { name: "Aptos", sz: 12, bold: true, color: { rgb: "FFFFFF" } },
      fill: fill("162334"),
      alignment: { horizontal: "left", vertical: "center", indent: 1 }
    };
    setRangeStyle("A9:D9", sectionStyle);
    setRangeStyle("A14:D14", {
      ...sectionStyle,
      fill: fill("B63835")
    });
    ["A10", "B10", "C10", "D10"].forEach((cell, index) => setRangeStyle(cell, {
      font: { name: "Aptos", sz: 9, bold: true, color: { rgb: "FFFFFF" } },
      fill: fill(["237653", "2861B8", "237653", "2861B8"][index]),
      alignment: { horizontal: "center", vertical: "center", wrapText: true }
    }));
    setRangeStyle("A11:D11", {
      ...currencyStyle,
      fill: fill("F0F6F4"),
      border: { bottom: { style: "thin", color: { rgb: "D6E4DD" } } }
    });
    if(report.payments.day.unclassified > 0 || report.payments.month.unclassified > 0){
      setRangeStyle("A12:D12", {
        font: { name: "Aptos", sz: 9, color: { rgb: "825915" } },
        fill: fill("F6EFDE"),
        numFmt: '"₡" #,##0',
        alignment: { vertical: "center", wrapText: true }
      });
      ["B12", "D12"].forEach(cell => setRangeStyle(cell, {
        ...currencyStyle,
        font: { name: "Aptos", sz: 10, bold: true, color: { rgb: "825915" } },
        fill: fill("F6EFDE")
      }));
    }

    ["A15:C15", "A16:C16", "A17:C17"].forEach((range, index) => setRangeStyle(range, {
      ...baseStyle,
      font: { name: "Aptos", sz: 11, bold: index === 2, color: { rgb: "263445" } },
      fill: fill(index === 2 ? "E5F2E9" : index === 0 ? "F1F5F8" : "FFFFFF"),
      border: { bottom: { style: "thin", color: { rgb: "DCE3E9" } } },
      alignment: { horizontal: "left", vertical: "center", indent: 1 }
    }));
    ["D15", "D16", "D17"].forEach((cell, index) => setRangeStyle(cell, {
      ...currencyStyle,
      font: { name: "Aptos", sz: 11, bold: true, color: { rgb: index === 2 ? "237653" : "162334" } },
      fill: fill(index === 2 ? "E5F2E9" : index === 0 ? "F1F5F8" : "FFFFFF"),
      border: { bottom: { style: "thin", color: { rgb: "DCE3E9" } } }
    }));
    setRangeStyle("A19:D19", {
      font: { name: "Aptos", sz: 9, italic: true, color: { rgb: "657487" } },
      fill: fill("F1F4F7"),
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "thin", color: { rgb: "BCC7D2" } } }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resumen ejecutivo");
    const turnRows = salesToday.map(sale => ({
      Fecha: sale.businessDate,
      Hora: sale.time || "",
      Producto: sale.product,
      Cantidad: sale.qty,
      "Precio unitario": sale.unit || "",
      Total: sale.total,
      "Método de pago": sale.paymentMethod || ""
    }));
    const turnSheet = XLSX.utils.json_to_sheet(turnRows);
    XLSX.utils.book_append_sheet(wb, turnSheet, "Ventas del turno");
    XLSX.writeFile(wb, `volcano-vibes-resumen-${getOpenDay().businessDate}.xlsx`);
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

  /* ---------- Init ---------- */
  setTab("day");
  renderAll();
  window.addEventListener("vv:cloud-sync", renderAll);
})();
