function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  (data.sheets || []).forEach(function(s) {
    var sh = ss.getSheetByName(s.name) || ss.insertSheet(s.name);
    sh.clearContents();
    var rows = s.rows;
    if (!rows || !rows.length) return;
    var w = 0;
    rows.forEach(function(r) { if (r.length > w) w = r.length; });
    var padded = rows.map(function(r) {
      var c = r.slice();
      while (c.length < w) c.push("");
      return c;
    });
    sh.getRange(1, 1, padded.length, w).setValues(padded);
  });
  // アプリで再読み込みできるよう、全データ(JSON)を隠しシート _data に保存
  if (data.state) {
    var dsh = ss.getSheetByName("_data") || ss.insertSheet("_data");
    dsh.clearContents();
    var json = JSON.stringify(data.state);
    var chunks = [];
    for (var i = 0; i < json.length; i += 40000) chunks.push([json.substring(i, i + 40000)]);
    dsh.getRange(1, 1, chunks.length, 1).setValues(chunks);
    try { dsh.hideSheet(); } catch (err) {}
  }
  return ContentService.createTextOutput("ok");
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("_data");
  var json = "";
  if (sh && sh.getLastRow() > 0) {
    json = sh.getRange(1, 1, sh.getLastRow(), 1).getValues()
      .map(function(r) { return r[0]; }).join("");
  }
  return ContentService.createTextOutput(json || "{}")
    .setMimeType(ContentService.MimeType.JSON);
}
