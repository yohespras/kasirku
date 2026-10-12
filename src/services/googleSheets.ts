import { Product, StoreProfile, Transaction } from '../types';
import { getAccessToken } from './auth';

export interface SheetSyncResult {
  success: boolean;
  message: string;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
}

// Generate Google Apps Script (Code.gs) template for user reference & standalone deployment
export const APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * KASIRPINTAR POS - GOOGLE APPS SCRIPT DATABASE & WEBHOOK (Code.gs)
 * =========================================================================
 * Script ini dapat dipasang langsung pada Google Sheets Anda (Extensions > Apps Script)
 * untuk menjadikan Google Sheets sebagai database REST API real-time dan web kasir.
 */

function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === "getProducts") {
    var sheet = ss.getSheetByName("Produk");
    if (!sheet) return jsonResponse({ error: "Sheet Produk tidak ditemukan" });
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var products = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      products.push({
        id: String(row[0]),
        barcode: String(row[1]),
        name: String(row[2]),
        category: String(row[3]),
        price: Number(row[4]) || 0,
        costPrice: Number(row[5]) || 0,
        stock: Number(row[6]) || 0,
        minStock: Number(row[7]) || 0,
        unit: String(row[8] || 'pcs'),
        updatedAt: row[9] ? String(row[9]) : new Date().toISOString()
      });
    }
    return jsonResponse({ success: true, data: products });
  }
  
  if (action === "getSummary") {
    var trxSheet = ss.getSheetByName("Transaksi");
    var totalTrx = trxSheet ? Math.max(0, trxSheet.getLastRow() - 1) : 0;
    return jsonResponse({ success: true, totalTransactions: totalTrx });
  }
  
  // Default HTML UI Web App
  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><title>KasirPintar Backend</title><meta charset="utf-8"></head>' +
    '<body style="font-family:sans-serif;padding:24px;background:#f8fafc;color:#1e293b;">' +
    '<h2>🚀 KasirPintar - Google Sheets REST API & Webhook</h2>' +
    '<p>Status: <strong>Aktif & Terhubung</strong></p>' +
    '<p>Spreadsheet: ' + ss.getName() + '</p>' +
    '<p>Gunakan endpoint ini untuk sinkronisasi otomatis POS Kasir Toko.</p>' +
    '</body></html>'
  ).setTitle("KasirPintar POS Server");
}

function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : "";
    var body = JSON.parse(rawData);
    var action = body.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "recordTransaction") {
      var trx = body.transaction;
      var trxSheet = getOrCreateSheet(ss, "Transaksi", [
        "ID Transaksi", "Waktu", "Kasir", "Role", "Metode Bayar",
        "Subtotal (Rp)", "Diskon (Rp)", "Total (Rp)", "Jumlah Diterima (Rp)",
        "Kembalian (Rp)", "Ref QRIS"
      ]);
      
      trxSheet.appendRow([
        trx.id,
        trx.date,
        trx.cashierName,
        trx.cashierRole,
        trx.paymentMethod,
        trx.subtotal,
        trx.discount,
        trx.total,
        trx.amountPaid,
        trx.change,
        trx.qrisRef || ""
      ]);
      
      // Update inventaris & detail transaksi
      var detailSheet = getOrCreateSheet(ss, "Detail_Transaksi", [
        "ID Transaksi", "Barcode", "Nama Barang", "Jumlah", "Harga Satuan (Rp)", "Subtotal (Rp)"
      ]);
      
      var prodSheet = ss.getSheetByName("Produk");
      var prodData = prodSheet ? prodSheet.getDataRange().getValues() : [];
      
      for (var j = 0; j < trx.items.length; j++) {
        var itm = trx.items[j];
        detailSheet.appendRow([
          trx.id,
          itm.barcode,
          itm.name,
          itm.quantity,
          itm.price,
          itm.subtotal
        ]);
        
        // Kurangi stok di sheet Produk
        if (prodSheet) {
          for (var r = 1; r < prodData.length; r++) {
            if (String(prodData[r][0]) === String(itm.productId) || String(prodData[r][1]) === String(itm.barcode)) {
              var currStock = Number(prodData[r][6]) || 0;
              var newStock = Math.max(0, currStock - itm.quantity);
              prodSheet.getRange(r + 1, 7).setValue(newStock);
              prodSheet.getRange(r + 1, 10).setValue(new Date().toISOString());
              break;
            }
          }
        }
      }
      
      return jsonResponse({ success: true, message: "Transaksi berhasil dicatat & stok dikurangi" });
    }
    
    return jsonResponse({ error: "Action tidak dikenali" });
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
    }
  }
  return sheet;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

/**
 * Direct Google Sheets API v4 Client using OAuth Access Token
 */

export async function searchOrCreateSpreadsheet(storeName: string): Promise<{ id: string; url: string; isNew: boolean }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Belum login dengan akun Google. Silakan klik Masuk dengan Google.');
  }

  const fileName = `KasirPintar - ${storeName || 'Database Toko'}`;

  // 1. Search Google Drive for existing spreadsheet
  try {
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(
      fileName
    )}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false&fields=files(id,name,webViewLink)`;

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const file = searchData.files[0];
        return {
          id: file.id,
          url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
          isNew: false,
        };
      }
    }
  } catch (err) {
    console.warn('Could not search existing file in Drive, proceeding to create:', err);
  }

  // 2. Create new Spreadsheet with proper sheets
  const createUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  const body = {
    properties: {
      title: fileName,
    },
    sheets: [
      {
        properties: {
          title: 'Produk',
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: 'Transaksi',
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: 'Detail_Transaksi',
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: 'Pengaturan',
          gridProperties: { frozenRowCount: 1 },
        },
      },
    ],
  };

  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Gagal membuat spreadsheet: ${errorText}`);
  }

  const newSheetData = await createRes.json();
  const spreadsheetId = newSheetData.spreadsheetId;
  const spreadsheetUrl =
    newSheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write headers to sheets
  await initSpreadsheetHeaders(spreadsheetId, token);

  return {
    id: spreadsheetId,
    url: spreadsheetUrl,
    isNew: true,
  };
}

async function initSpreadsheetHeaders(spreadsheetId: string, token: string) {
  const headers = [
    {
      range: 'Produk!A1:J1',
      values: [
        [
          'ID Produk',
          'Barcode / SKU',
          'Nama Produk',
          'Kategori',
          'Harga Jual (Rp)',
          'Harga Modal / HPP (Rp)',
          'Sisa Stok',
          'Batas Minimum Stok',
          'Satuan',
          'Terakhir Diperbarui',
        ],
      ],
    },
    {
      range: 'Transaksi!A1:K1',
      values: [
        [
          'ID Transaksi',
          'Waktu Transaksi',
          'Nama Kasir',
          'Peran Kasir',
          'Metode Pembayaran',
          'Subtotal (Rp)',
          'Diskon (Rp)',
          'Total Belanja (Rp)',
          'Uang Diterima (Rp)',
          'Kembalian (Rp)',
          'Ref / Catatan QRIS',
        ],
      ],
    },
    {
      range: 'Detail_Transaksi!A1:F1',
      values: [
        [
          'ID Transaksi',
          'Barcode',
          'Nama Barang',
          'Jumlah (Qty)',
          'Harga Satuan (Rp)',
          'Subtotal (Rp)',
        ],
      ],
    },
    {
      range: 'Pengaturan!A1:B1',
      values: [['Kunci Konfigurasi', 'Nilai']],
    },
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: headers,
    }),
  });
}

/**
 * Push all products to Google Sheet
 */
export async function pushProductsToSheet(
  spreadsheetId: string,
  products: Product[]
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  const rows = products.map((p) => [
    p.id,
    p.barcode,
    p.name,
    p.category,
    p.price,
    p.costPrice,
    p.stock,
    p.minStock,
    p.unit,
    p.updatedAt,
  ]);

  // Clear existing product rows below header
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Produk!A2:J1000:clear`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // Write new rows
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Produk!A2?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );

  return res.ok;
}

/**
 * Fetch products from Google Sheet
 */
export async function fetchProductsFromSheet(spreadsheetId: string): Promise<Product[] | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Produk!A2:J1000`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  if (!data.values || data.values.length === 0) return [];

  return data.values
    .filter((row: any[]) => row && row[0] && row[2])
    .map((row: any[]) => ({
      id: String(row[0] || ''),
      barcode: String(row[1] || ''),
      name: String(row[2] || ''),
      category: String(row[3] || 'Umum'),
      price: Number(row[4]) || 0,
      costPrice: Number(row[5]) || 0,
      stock: Number(row[6]) || 0,
      minStock: Number(row[7]) || 5,
      unit: String(row[8] || 'pcs'),
      updatedAt: String(row[9] || new Date().toISOString()),
    }));
}

/**
 * Sync transaction directly to Google Sheet in real-time
 */
export async function appendTransactionToSheet(
  spreadsheetId: string,
  transaction: Transaction,
  updatedProducts: Product[]
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  try {
    // 1. Append Transaksi row
    const trxRow = [
      transaction.id,
      transaction.date,
      transaction.cashierName,
      transaction.cashierRole,
      transaction.paymentMethod,
      transaction.subtotal,
      transaction.discount,
      transaction.total,
      transaction.amountPaid,
      transaction.change,
      transaction.qrisRef || '',
    ];

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Transaksi!A:K:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [trxRow],
        }),
      }
    );

    // 2. Append Detail_Transaksi rows
    const detailRows = transaction.items.map((item) => [
      transaction.id,
      item.barcode,
      item.name,
      item.quantity,
      item.price,
      item.subtotal,
    ]);

    if (detailRows.length > 0) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Detail_Transaksi!A:F:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: detailRows,
          }),
        }
      );
    }

    // 3. Update products stock in sheet
    await pushProductsToSheet(spreadsheetId, updatedProducts);

    return true;
  } catch (err) {
    console.error('Error syncing transaction to Google Sheets:', err);
    return false;
  }
}
