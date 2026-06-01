/**
 * File: Code.gs
 * Fungsi untuk melayani Web App dan mengambil data dari Spreadsheet
 */

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('FinanceFlow Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Mengambil data dari sheet 'Data'
 * Melewati 3 baris pertama, baris 4 adalah header
 */
function getSheetData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Data'); 
    
    if (!sheet) throw new Error("Sheet bernama 'Data' tidak ditemukan!");
    
    const fullData = sheet.getDataRange().getValues();
    
    // Baris 1-3 (indeks 0-2) tidak digunakan
    // Baris 4 (indeks 3) adalah Header
    const rows = fullData.slice(4); 
    
    let summary = { income: 0, expense: 0, balance: 0 };
    const transactions = [];
    
    rows.forEach((row, index) => {
      // Jika baris dimulai dengan "Total", ambil nilainya sebagai ringkasan akhir
      if (row[0] === "Total") {
        summary.income = Number(row[4]) || 0;
        summary.expense = Number(row[5]) || 0;
        summary.balance = Number(row[6]) || 0;
        return;
      }
      
      // Lewati baris kosong
      if (!row[0]) return; 
      
      transactions.push({
        date: Utilities.formatDate(new Date(row[0]), ss.getSpreadsheetTimeZone(), "dd/MM/yyyy"),
        month: row[1],
        category: row[2],
        description: row[3],
        income: Number(row[4]) || 0,
        expense: Number(row[5]) || 0,
        balance: Number(row[6]) || 0,
        id: 'tx-' + index
      });
    });
    
    return {
      transactions: transactions,
      totals: summary
    };
    
  } catch (e) {
    return { error: e.toString() };
  }
}