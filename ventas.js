(function(){
  "use strict";
  const {
    CRC, monthKey, getOpenDay, loadDay, loadArchive, loadExpenseDay, loadExpenseArchive,
    getMonthRows, getOpenDaySales, getOpenDayExpenses, closeOpenDay
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

  function setTab(tab){
    tabDay.classList.toggle("tab--active", tab === "day");
    tabMonth.classList.toggle("tab--active", tab === "month");
    tabDay.setAttribute("aria-selected", tab === "day");
    tabMonth.setAttribute("aria-selected", tab === "month");
    panelDay.style.display = tab === "day" ? "" : "none";
    panelMonth.style.display = tab === "month" ? "" : "none";
  }
  tabDay.addEventListener("click", () => setTab("day"));
  tabMonth.addEventListener("click", () => setTab("month"));

  /* ---------- Datos base del reporte ---------- */
  const sumTotal = list => list.reduce((s, i) => s + (Number(i.total) || 0), 0);

  function paymentKey(sale){
    const method = String(sale.paymentMethod || "").toLowerCase();
    if(method === "cash" || method === "efectivo") return "cash";
    if(method === "card" || method === "tarjeta") return "card";
    return "unclassified";
  }
  function paymentLabel(sale){
    const key = paymentKey(sale);
    return key === "cash" ? "Efectivo" : key === "card" ? "Tarjeta" : "Sin método";
  }
  function sumPayments(sales){
    return sales.reduce((acc, sale) => {
      acc[paymentKey(sale)] += Number(sale.total) || 0;
      return acc;
    }, { cash: 0, card: 0, unclassified: 0 });
  }

  function getTodaySales(){ return getOpenDaySales(); }

  function getMonthSales(){
    const month = monthKey(getOpenDay().businessDate);
    return loadArchive().concat(loadDay().items)
      .filter(item => item.businessDate && monthKey(item.businessDate) === month);
  }
  function getMonthExpenses(){
    const month = monthKey(getOpenDay().businessDate);
    return loadExpenseArchive().concat(loadExpenseDay().items)
      .filter(item => item.businessDate && monthKey(item.businessDate) === month);
  }

  /* ---------- Ventas, pagos y ganancia neta (hoy y mes) ---------- */
  function getFinancials(){
    const salesDay = getTodaySales();
    const salesMonth = getMonthSales();
    const ventasHoy = sumTotal(salesDay);
    const ventasMes = sumTotal(salesMonth);
    const gastosHoy = sumTotal(getOpenDayExpenses());
    const gastosMes = sumTotal(getMonthExpenses());

    return {
      ventasHoy, gastosHoy, gananciaHoy: ventasHoy - gastosHoy,
      ventasMes, gastosMes, gananciaMes: ventasMes - gastosMes,
      pagosHoy: sumPayments(salesDay),
      pagosMes: sumPayments(salesMonth)
    };
  }

  function getReportContext(){
    const now = new Date();
    const openDay = getOpenDay();
    const businessDate = new Date(openDay.businessDate + "T00:00:00");
    const hour = now.getHours();
    const monthName = businessDate.toLocaleDateString("es-CR", { month: "long", year: "numeric" });
    return {
      date: businessDate.toLocaleDateString("es-CR", { day: "2-digit", month: "2-digit", year: "numeric" }),
      monthLabel: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      time: now.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      shift: hour >= 5 && hour < 12 ? "Mañana" : hour >= 12 && hour < 18 ? "Tarde" : "Noche",
      cashier: window.VV.AUTH.currentUser()
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
  document.getElementById("btnCierreDia").addEventListener("click", () => {
    const ok = confirm("¿Cerrar el día? Las cifras de hoy volverán a ₡0. Lo registrado queda guardado.");
    if(!ok) return;
    closeOpenDay();
    renderAll();
    toast("Día cerrado correctamente.");
  });

  /* =========================================================
     Exportar PDF
     Nota: las fuentes estándar de PDF no incluyen el símbolo ₡,
     por eso en el PDF los montos se muestran como "CRC 12,500".
     ========================================================= */
  const pdfMoney = n => {
    const v = Math.round(Number(n) || 0);
    const digits = String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (v < 0 ? "-" : "") + "CRC " + digits;
  };

  document.getElementById("btnPdf").addEventListener("click", () => {
    try{
      if(!window.jspdf || !window.jspdf.jsPDF){
        toast("No se pudo cargar la librería de PDF. Revisa tu conexión a internet.");
        return;
      }
      const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
      if(typeof doc.autoTable !== "function"){
        toast("No se pudo cargar el módulo de tablas del PDF. Revisa tu conexión a internet.");
        return;
      }

      const f = getFinancials();
      const report = getReportContext();
      const salesToday = [...getTodaySales()].sort((a, b) => (a.ts || 0) - (b.ts || 0));
      const monthRows = getMonthRows(loadDay());

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const left = 18;
      const right = pageWidth - 18;
      const DARK = [22, 35, 52];
      const RED = [182, 56, 53];
      const GREEN = [35, 118, 83];

      /* --- Encabezado --- */
      doc.setTextColor(15, 20, 24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Volcano Vibes", left, 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text("Comidas Rápidas · Reporte de ventas y ganancias", left, 27);

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`Fecha: ${report.date}`, right, 13, { align: "right" });
      doc.text(`Hora: ${report.time} (Costa Rica)`, right, 18, { align: "right" });
      doc.text(`Turno: ${report.shift}`, right, 23, { align: "right" });
      doc.text(`Cajero: ${report.cashier}`, right, 28, { align: "right" });

      doc.setDrawColor(RED[0], RED[1], RED[2]);
      doc.setLineWidth(0.8);
      doc.line(left, 33, right, 33);
      doc.setLineWidth(0.2);

      /* --- Resumen financiero (día y mes) --- */
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(DARK[0], DARK[1], DARK[2]);
      doc.text("Resumen financiero", left, 43);

      const kinds = [];
      const body = [];
      const addLine = (kind, label, dayValue, monthValue) => {
        kinds.push({ kind, dayValue, monthValue });
        body.push([label, pdfMoney(dayValue), pdfMoney(monthValue)]);
      };
      addLine("sales", "Ventas totales", f.ventasHoy, f.ventasMes);
      addLine("cash", "Pagos en efectivo", f.pagosHoy.cash, f.pagosMes.cash);
      addLine("card", "Pagos con tarjeta", f.pagosHoy.card, f.pagosMes.card);
      if(f.pagosHoy.unclassified > 0 || f.pagosMes.unclassified > 0){
        addLine("warn", "Ventas sin método de pago registrado", f.pagosHoy.unclassified, f.pagosMes.unclassified);
      }
      addLine("expense", "(-) Gastos registrados", f.gastosHoy, f.gastosMes);
      addLine("net", "(=) Ganancia neta (Ventas - Gastos)", f.gananciaHoy, f.gananciaMes);

      doc.autoTable({
        startY: 47,
        margin: { left, right: left },
        head: [["Concepto", `Hoy · ${report.date}`, `Mes · ${report.monthLabel}`]],
        body,
        theme: "grid",
        styles: { font: "helvetica", fontSize: 10, cellPadding: 3.4, lineColor: [210, 215, 222], lineWidth: 0.2, textColor: [30, 38, 50] },
        headStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: "bold" },
        columnStyles: { 1: { halign: "right", cellWidth: 48 }, 2: { halign: "right", cellWidth: 48 } },
        didParseCell: data => {
          if(data.section === "head" && data.column.index > 0){ data.cell.styles.halign = "right"; }
          if(data.section !== "body") return;
          const info = kinds[data.row.index];
          if(!info) return;
          if(info.kind === "cash"){ data.cell.styles.fillColor = [226, 243, 233]; }
          if(info.kind === "card"){ data.cell.styles.fillColor = [226, 236, 250]; }
          if(info.kind === "warn"){ data.cell.styles.fillColor = [246, 239, 222]; }
          if(info.kind === "net"){
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fontSize = 11;
            const value = data.column.index === 1 ? info.dayValue : info.monthValue;
            if(data.column.index === 0){
              data.cell.styles.fillColor = [236, 240, 244];
            }else{
              data.cell.styles.fillColor = value < 0 ? [251, 227, 227] : [229, 242, 233];
              data.cell.styles.textColor = value < 0 ? RED : GREEN;
            }
          }
        }
      });

      /* --- Firmas --- */
      let signY = doc.lastAutoTable.finalY + 38;
      if(signY > pageHeight - 25){ doc.addPage(); signY = 60; }
      doc.setDrawColor(120, 120, 120);
      doc.line(left, signY, left + 70, signY);
      doc.line(right - 70, signY, right, signY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(90, 90, 90);
      doc.text("Firma Cajero(a) / Operador", left + 35, signY + 5, { align: "center" });
      doc.text("Firma Encargado / Administrador", right - 35, signY + 5, { align: "center" });

      /* --- Detalle: ventas del turno --- */
      doc.addPage();
      doc.setTextColor(15, 20, 24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("Ventas del turno abierto", left, 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text(`Fecha de negocio: ${report.date}`, left, 27);

      const turnQty = salesToday.reduce((s, i) => s + (Number(i.qty) || 0), 0);
      doc.autoTable({
        startY: 32,
        margin: { left, right: left },
        head: [["Hora", "Producto", "Cant.", "Método", "Total"]],
        body: salesToday.length
          ? salesToday.map(s => [s.time || "", s.product, String(s.qty), paymentLabel(s), pdfMoney(s.total)])
          : [[{ content: "Sin ventas registradas en el turno actual.", colSpan: 5, styles: { halign: "center", textColor: [120, 120, 120] } }]],
        foot: [["", "TOTAL DEL TURNO", String(turnQty), "", pdfMoney(f.ventasHoy)]],
        showFoot: "lastPage",
        theme: "striped",
        styles: { font: "helvetica", fontSize: 9, cellPadding: 2.6 },
        headStyles: { fillColor: RED, textColor: [255, 255, 255] },
        footStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [247, 248, 250] },
        columnStyles: { 0: { cellWidth: 20 }, 2: { halign: "center", cellWidth: 16 }, 3: { cellWidth: 28 }, 4: { halign: "right", cellWidth: 34 } }
      });

      /* --- Detalle: acumulado del mes por producto --- */
      doc.addPage();
      doc.setTextColor(15, 20, 24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("Acumulado del mes por producto", left, 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text(report.monthLabel, left, 27);

      const monthQty = monthRows.reduce((s, r) => s + (Number(r.qty) || 0), 0);
      doc.autoTable({
        startY: 32,
        margin: { left, right: left },
        head: [["Producto", "Cant.", "Total acumulado"]],
        body: monthRows.length
          ? monthRows.map(r => [r.product, String(r.qty), pdfMoney(r.total)])
          : [[{ content: "Todavía no hay ventas acumuladas este mes.", colSpan: 3, styles: { halign: "center", textColor: [120, 120, 120] } }]],
        foot: [["TOTAL DEL MES", String(monthQty), pdfMoney(f.ventasMes)]],
        showFoot: "lastPage",
        theme: "striped",
        styles: { font: "helvetica", fontSize: 9, cellPadding: 2.6 },
        headStyles: { fillColor: RED, textColor: [255, 255, 255] },
        footStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [247, 248, 250] },
        columnStyles: { 1: { halign: "center", cellWidth: 20 }, 2: { halign: "right", cellWidth: 44 } }
      });

      /* --- Pie de página en todas las hojas --- */
      const pages = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pages; i++){
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text("Volcano Vibes · Reporte de ventas", left, pageHeight - 8);
        doc.text(`Página ${i} de ${pages}`, right, pageHeight - 8, { align: "right" });
      }

      doc.save(`volcano-vibes-reporte-${getOpenDay().businessDate}.pdf`);
    }catch(err){
      console.error("Error al generar el PDF:", err);
      toast("No se pudo generar el PDF: " + (err && err.message ? err.message : "error desconocido"));
    }
  });

  /* =========================================================
     Exportar Excel (xlsx-js-style)
     ========================================================= */
  document.getElementById("btnXlsx").addEventListener("click", () => {
    try{
      if(typeof XLSX === "undefined"){
        toast("No se pudo cargar la librería de Excel. Revisa tu conexión a internet.");
        return;
      }

      const f = getFinancials();
      const report = getReportContext();
      const salesToday = [...getTodaySales()].sort((a, b) => (a.ts || 0) - (b.ts || 0));
      const monthRows = getMonthRows(loadDay());

      const FMT = '"₡"#,##0;[Red]-"₡"#,##0';
      const fill = rgb => ({ patternType: "solid", fgColor: { rgb } });
      const thin = { style: "thin", color: { rgb: "D5DCE4" } };
      const box = { top: thin, bottom: thin, left: thin, right: thin };
      const font = (opts) => Object.assign({ name: "Calibri", sz: 11, color: { rgb: "263445" } }, opts || {});

      const setStyle = (ws, r, c, style) => {
        const addr = XLSX.utils.encode_cell({ r, c });
        if(!ws[addr]) ws[addr] = { t: "s", v: "" };
        ws[addr].s = style;
      };
      const setRow = (ws, r, fromC, toC, style) => {
        for(let c = fromC; c <= toC; c++) setStyle(ws, r, c, style);
      };

      /* ----- Hoja 1: Resumen ----- */
      const rows = [];
      rows.push(["Volcano Vibes", "", ""]);                                            // 0
      rows.push(["Comidas Rápidas · Reporte de ventas y ganancias", "", ""]);          // 1
      rows.push(["Fecha", report.date, ""]);                                           // 2
      rows.push(["Hora", report.time + " (Costa Rica)", ""]);                          // 3
      rows.push(["Turno", report.shift, ""]);                                          // 4
      rows.push(["Cajero", report.cashier, ""]);                                       // 5
      rows.push(["", "", ""]);                                                         // 6
      rows.push(["RESUMEN FINANCIERO", "Hoy · " + report.date, "Mes · " + report.monthLabel]); // 7

      const lines = [
        { kind: "sales", label: "Ventas totales", d: f.ventasHoy, m: f.ventasMes },
        { kind: "cash", label: "Pagos en efectivo", d: f.pagosHoy.cash, m: f.pagosMes.cash },
        { kind: "card", label: "Pagos con tarjeta", d: f.pagosHoy.card, m: f.pagosMes.card }
      ];
      if(f.pagosHoy.unclassified > 0 || f.pagosMes.unclassified > 0){
        lines.push({ kind: "warn", label: "Ventas sin método de pago registrado", d: f.pagosHoy.unclassified, m: f.pagosMes.unclassified });
      }
      lines.push({ kind: "expense", label: "(-) Gastos registrados", d: f.gastosHoy, m: f.gastosMes });
      lines.push({ kind: "net", label: "(=) Ganancia neta (Ventas - Gastos)", d: f.gananciaHoy, m: f.gananciaMes });

      const firstLine = rows.length; // 8
      lines.forEach(l => rows.push([l.label, l.d, l.m]));
      const lastLine = rows.length - 1;
      rows.push(["", "", ""]);                                                        // espacio
      const signLineRow = rows.length; rows.push(["", "", ""]);                        // línea de firma
      const signLabelRow = rows.length; rows.push(["Firma Cajero(a) / Operador", "", "Firma Encargado / Administrador"]);

      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws["!cols"] = [{ wch: 42 }, { wch: 26 }, { wch: 34 }];
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
        { s: { r: 2, c: 1 }, e: { r: 2, c: 2 } },
        { s: { r: 3, c: 1 }, e: { r: 3, c: 2 } },
        { s: { r: 4, c: 1 }, e: { r: 4, c: 2 } },
        { s: { r: 5, c: 1 }, e: { r: 5, c: 2 } }
      ];
      ws["!rows"] = [];
      ws["!rows"][0] = { hpt: 34 };
      ws["!rows"][1] = { hpt: 22 };
      ws["!rows"][7] = { hpt: 26 };
      ws["!rows"][signLineRow] = { hpt: 38 };
      ws["!rows"][signLabelRow] = { hpt: 22 };

      setRow(ws, 0, 0, 2, { font: font({ name: "Calibri", sz: 20, bold: true, color: { rgb: "FFFFFF" } }), fill: fill("162334"), alignment: { horizontal: "left", vertical: "center", indent: 1 } });
      setRow(ws, 1, 0, 2, { font: font({ sz: 11, color: { rgb: "FFE2CF" } }), fill: fill("293A4D"), alignment: { horizontal: "left", vertical: "center", indent: 1 } });
      for(let r = 2; r <= 5; r++){
        setStyle(ws, r, 0, { font: font({ sz: 10, bold: true, color: { rgb: "526276" } }), fill: fill("EEF2F6"), border: box, alignment: { vertical: "center", indent: 1 } });
        setStyle(ws, r, 1, { font: font(), fill: fill("F7F9FB"), border: box, alignment: { horizontal: "left", vertical: "center", indent: 1 } });
        setStyle(ws, r, 2, { font: font(), fill: fill("F7F9FB"), border: box });
      }
      setStyle(ws, 7, 0, { font: font({ bold: true, color: { rgb: "FFFFFF" } }), fill: fill("162334"), border: box, alignment: { horizontal: "left", vertical: "center", indent: 1 } });
      setStyle(ws, 7, 1, { font: font({ bold: true, color: { rgb: "FFFFFF" } }), fill: fill("162334"), border: box, alignment: { horizontal: "right", vertical: "center", wrapText: true } });
      setStyle(ws, 7, 2, { font: font({ bold: true, color: { rgb: "FFFFFF" } }), fill: fill("162334"), border: box, alignment: { horizontal: "right", vertical: "center", wrapText: true } });

      lines.forEach((l, i) => {
        const r = firstLine + i;
        let bg = "FFFFFF", color = "263445", bold = false, sz = 11;
        if(l.kind === "sales"){ bg = "F1F5F8"; bold = true; }
        if(l.kind === "cash"){ bg = "E2F3E9"; color = "1F6B4A"; bold = true; }
        if(l.kind === "card"){ bg = "E2ECFA"; color = "2152A0"; bold = true; }
        if(l.kind === "warn"){ bg = "F6EFDE"; color = "825915"; }
        if(l.kind === "net"){ bold = true; sz = 12; }
        ws["!rows"][r] = { hpt: l.kind === "net" ? 28 : 22 };
        setStyle(ws, r, 0, { font: font({ sz, bold, color: { rgb: color } }), fill: fill(l.kind === "net" ? "ECF0F4" : bg), border: box, alignment: { horizontal: "left", vertical: "center", indent: 1 } });
        [[1, l.d], [2, l.m]].forEach(([c, value]) => {
          let cellColor = color, cellBg = bg;
          if(l.kind === "net"){
            cellColor = value < 0 ? "B63835" : "237653";
            cellBg = value < 0 ? "FBE3E3" : "E5F2E9";
          }
          setStyle(ws, r, c, { font: font({ sz, bold: true, color: { rgb: cellColor } }), fill: fill(cellBg), border: box, numFmt: FMT, alignment: { horizontal: "right", vertical: "center" } });
        });
      });

      const signBorder = { bottom: { style: "thin", color: { rgb: "657487" } } };
      setStyle(ws, signLineRow, 0, { font: font(), border: signBorder });
      setStyle(ws, signLineRow, 2, { font: font(), border: signBorder });
      [0, 2].forEach(c => setStyle(ws, signLabelRow, c, { font: font({ sz: 9, italic: true, color: { rgb: "657487" } }), alignment: { horizontal: "center", vertical: "center" } }));

      /* ----- Hoja 2: Ventas del turno ----- */
      const turnHead = ["Fecha", "Hora", "Producto", "Cantidad", "Precio unitario", "Método de pago", "Total"];
      const turnRows = [turnHead];
      salesToday.forEach(s => turnRows.push([
        s.businessDate || "", s.time || "", s.product, Number(s.qty) || 0, Number(s.unit) || 0, paymentLabel(s), Number(s.total) || 0
      ]));
      const turnTotalRow = turnRows.length;
      turnRows.push(["", "", "TOTAL DEL TURNO", salesToday.reduce((s, i) => s + (Number(i.qty) || 0), 0), "", "", f.ventasHoy]);
      const wsTurn = XLSX.utils.aoa_to_sheet(turnRows);
      wsTurn["!cols"] = [{ wch: 12 }, { wch: 9 }, { wch: 40 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];
      for(let c = 0; c < turnHead.length; c++){
        setStyle(wsTurn, 0, c, { font: font({ bold: true, color: { rgb: "FFFFFF" } }), fill: fill("B63835"), border: box, alignment: { horizontal: c >= 3 ? "center" : "left", vertical: "center", wrapText: true } });
      }
      for(let r = 1; r < turnTotalRow; r++){
        for(let c = 0; c < turnHead.length; c++){
          const money = c === 4 || c === 6;
          setStyle(wsTurn, r, c, {
            font: font(), border: box, fill: fill(r % 2 === 0 ? "F7F8FA" : "FFFFFF"),
            numFmt: money ? FMT : undefined,
            alignment: { horizontal: money ? "right" : c === 3 ? "center" : "left", vertical: "center" }
          });
        }
      }
      for(let c = 0; c < turnHead.length; c++){
        const money = c === 6;
        setStyle(wsTurn, turnTotalRow, c, {
          font: font({ bold: true, color: { rgb: "FFFFFF" } }), fill: fill("162334"), border: box,
          numFmt: money ? FMT : undefined,
          alignment: { horizontal: money ? "right" : c === 3 ? "center" : "left", vertical: "center" }
        });
      }
      if(salesToday.length){ wsTurn["!autofilter"] = { ref: "A1:G" + (salesToday.length + 1) }; }

      /* ----- Hoja 3: Acumulado del mes ----- */
      const monthHead = ["Producto", "Cantidad", "Total acumulado"];
      const monthSheetRows = [monthHead];
      monthRows.forEach(r => monthSheetRows.push([r.product, Number(r.qty) || 0, Number(r.total) || 0]));
      const monthTotalRow = monthSheetRows.length;
      monthSheetRows.push(["TOTAL DEL MES", monthRows.reduce((s, r) => s + (Number(r.qty) || 0), 0), f.ventasMes]);
      const wsMonth = XLSX.utils.aoa_to_sheet(monthSheetRows);
      wsMonth["!cols"] = [{ wch: 42 }, { wch: 12 }, { wch: 20 }];
      for(let c = 0; c < 3; c++){
        setStyle(wsMonth, 0, c, { font: font({ bold: true, color: { rgb: "FFFFFF" } }), fill: fill("B63835"), border: box, alignment: { horizontal: c === 0 ? "left" : c === 1 ? "center" : "right", vertical: "center" } });
      }
      for(let r = 1; r < monthTotalRow; r++){
        setStyle(wsMonth, r, 0, { font: font(), border: box, fill: fill(r % 2 === 0 ? "F7F8FA" : "FFFFFF"), alignment: { horizontal: "left", vertical: "center" } });
        setStyle(wsMonth, r, 1, { font: font(), border: box, fill: fill(r % 2 === 0 ? "F7F8FA" : "FFFFFF"), alignment: { horizontal: "center", vertical: "center" } });
        setStyle(wsMonth, r, 2, { font: font(), border: box, fill: fill(r % 2 === 0 ? "F7F8FA" : "FFFFFF"), numFmt: FMT, alignment: { horizontal: "right", vertical: "center" } });
      }
      setStyle(wsMonth, monthTotalRow, 0, { font: font({ bold: true, color: { rgb: "FFFFFF" } }), fill: fill("162334"), border: box, alignment: { horizontal: "left", vertical: "center" } });
      setStyle(wsMonth, monthTotalRow, 1, { font: font({ bold: true, color: { rgb: "FFFFFF" } }), fill: fill("162334"), border: box, alignment: { horizontal: "center", vertical: "center" } });
      setStyle(wsMonth, monthTotalRow, 2, { font: font({ bold: true, color: { rgb: "FFFFFF" } }), fill: fill("162334"), border: box, numFmt: FMT, alignment: { horizontal: "right", vertical: "center" } });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Resumen");
      XLSX.utils.book_append_sheet(wb, wsTurn, "Ventas del turno");
      XLSX.utils.book_append_sheet(wb, wsMonth, "Acumulado del mes");
      XLSX.writeFile(wb, `volcano-vibes-reporte-${getOpenDay().businessDate}.xlsx`);
    }catch(err){
      console.error("Error al generar el Excel:", err);
      toast("No se pudo generar el Excel: " + (err && err.message ? err.message : "error desconocido"));
    }
  });

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg){
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("toast--show"), 3500);
  }

  /* ---------- Init ---------- */
  setTab("day");
  renderAll();
  window.addEventListener("vv:cloud-sync", renderAll);
})();
