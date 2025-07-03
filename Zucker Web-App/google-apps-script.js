function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  addNewScan(data);

  return ContentService.createTextOutput(JSON.stringify({ result: 'POST received' }))
    .setMimeType(ContentService.MimeType.JSON)
    .appendHeader("Access-Control-Allow-Origin", "*")
    .appendHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .appendHeader("Access-Control-Allow-Headers", "Content-Type");
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .appendHeader("Access-Control-Allow-Origin", "*")
    .appendHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .appendHeader("Access-Control-Allow-Headers", "Content-Type");
}

function addNewScan(obj) {
  const ss = SpreadsheetApp.openById('1ulSBoeYa0n3jV8AF9qoFjdEXQe5UVbVdE77oQKAHHPE');
  const sheetObj = ss.getSheetByName("Scanned");
  //const sheetObj = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tabelle");
  const sheetData = sheetObj.getDataRange().getValues();
  const [entryNum,entryData] = returnExistingEntry(sheetData, obj.id, 0);

  if(entryData != undefined) {
    // Update value in column "Count" of the specified row
    const value = entryData[4] + 1;
    sheetObj.getRange(entryNum + 1, 5).setValue(value);

  } else {
    // Add new entry
    sheetObj.appendRow([obj.id, obj.name, obj.amount, obj.sugar, 1]);
  }
}

function returnExistingEntry(data, obj, column) {
  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    // Check if scanned product already exists in table
    if(obj == row[column]) {
      return [i,row];
    }
  }
  return [undefined,undefined];
}

function onChange(e) {
  const sheetName = "Scanned";
  const targetSheetName = "Lookup";

  const ss = SpreadsheetApp.openById('1ulSBoeYa0n3jV8AF9qoFjdEXQe5UVbVdE77oQKAHHPE');
  const sourceSheet = ss.getSheetByName(sheetName);
  const targetSheet = ss.getSheetByName(targetSheetName);

  const data = sourceSheet.getDataRange().getValues();

  // Clear and rebuild Target if you want to prevent duplicates
  // Otherwise comment out the next line
  targetSheet.clearContents();

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row[4] > 2) {
      targetSheet.appendRow(row);
    }
  }
}