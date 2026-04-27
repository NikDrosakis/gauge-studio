// downloadWorker.js
importScripts("https://unpkg.com/exceljs/dist/exceljs.min.js");

self.onmessage = async (evt) => {
  const { data, sensors } = evt.data;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Data");
  ws.views = [{ state: "frozen", ySplit: 1 }];
  // define columns
  const cols = [];
  sensors.forEach((s) => {
    cols.push(
      { header: s.label.toUpperCase() + " DATE", key: s.value + "_date" },
      { header: s.label.toUpperCase() + " VALUE", key: s.value + "_value" }
    );
  });
  ws.columns = cols;

  // helper to strip ms
  const stripMs = (v) =>
    typeof v === "string" && v.includes(".") ? v.split(".")[0] : v;

  // build rows
  const maxLen = ws.columns.map((c) => c.header.length);
  const maxRows = Math.max(...data.map((s) => s.x.length));
  for (let i = 0; i < maxRows; i++) {
    const row = {};
    data.forEach((series, si) => {
      const dt = stripMs(series.x[i] || "");
      const val = String(series.y[i] ?? "");
      row[sensors[si].value + "_date"] = dt;
      row[sensors[si].value + "_value"] = val;

      // track for auto-width
      const di = si * 2,
        vi = si * 2 + 1;
      maxLen[di] = Math.max(maxLen[di], dt.length);
      maxLen[vi] = Math.max(maxLen[vi], val.length);
    });
    ws.addRow(row);
    if (i % 500 === 0) await new Promise((r) => setTimeout(r, 0));
  }

  // auto-fit widths
  ws.columns.forEach((col, idx) => {
    col.width = Math.min(Math.max(maxLen[idx] + 2, 10), 50);
  });

  // serialize
  const buffer = await wb.xlsx.writeBuffer();
  self.postMessage(buffer, [buffer]);
};
