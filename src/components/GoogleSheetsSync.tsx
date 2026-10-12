import React, { useState } from 'react';
import {
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Download,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowUpRight,
  Sparkles,
  Link2,
} from 'lucide-react';
import { GoogleSheetsConfig, Product, StoreProfile, Transaction } from '../types';
import {
  APPS_SCRIPT_CODE,
  fetchProductsFromSheet,
  pushProductsToSheet,
  searchOrCreateSpreadsheet,
} from '../services/googleSheets';
import { getAccessToken, googleSignIn } from '../services/auth';

interface GoogleSheetsSyncProps {
  products: Product[];
  transactions: Transaction[];
  storeProfile: StoreProfile;
  config: GoogleSheetsConfig;
  onUpdateConfig: (cfg: GoogleSheetsConfig) => void;
  onImportProducts: (imported: Product[]) => void;
  isDark?: boolean;
}

export const GoogleSheetsSync: React.FC<GoogleSheetsSyncProps> = ({
  products,
  transactions,
  storeProfile,
  config,
  onUpdateConfig,
  onImportProducts,
  isDark = false,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'status' | 'code'>('status');

  const handleConnectSheet = async () => {
    setIsSyncing(true);
    setSyncMessage('Menghubungkan ke Google Drive & mencari atau membuat Spreadsheet Toko...');
    try {
      let token = await getAccessToken();
      if (!token) {
        const signResult = await googleSignIn();
        token = signResult?.accessToken || null;
      }

      if (!token) {
        throw new Error('Izin Google diperlukan.');
      }

      const sheetInfo = await searchOrCreateSpreadsheet(storeProfile.name);

      // Push initial products
      await pushProductsToSheet(sheetInfo.id, products);

      onUpdateConfig({
        spreadsheetId: sheetInfo.id,
        spreadsheetName: `KasirPintar - ${storeProfile.name}`,
        spreadsheetUrl: sheetInfo.url,
        lastSyncedAt: new Date().toISOString(),
        autoSync: true,
        status: 'connected',
      });

      setSyncMessage(
        sheetInfo.isNew
          ? 'Spreadsheet Google baru berhasil dibuat dan seluruh produk toko telah disinkronkan!'
          : 'Spreadsheet yang ada ditemukan dan berhasil dihubungkan ke sistem POS!'
      );
    } catch (err: any) {
      console.error(err);
      setSyncMessage(`Gagal menghubungkan: ${err.message}`);
      onUpdateConfig({
        ...config,
        status: 'error',
        errorMessage: err.message,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleManualPush = async () => {
    if (!config.spreadsheetId) return;
    setIsSyncing(true);
    setSyncMessage('Mengunggah data inventaris ke Google Sheet...');
    try {
      const ok = await pushProductsToSheet(config.spreadsheetId, products);
      if (ok) {
        setSyncMessage('Data inventaris berhasil diunggah ke Google Sheets!');
        onUpdateConfig({
          ...config,
          lastSyncedAt: new Date().toISOString(),
          status: 'connected',
        });
      }
    } catch (err: any) {
      setSyncMessage(`Gagal upload: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullFromSheet = async () => {
    if (!config.spreadsheetId) return;
    setIsSyncing(true);
    setSyncMessage('Mengunduh data produk terbaru dari Google Sheet...');
    try {
      const imported = await fetchProductsFromSheet(config.spreadsheetId);
      if (imported && imported.length > 0) {
        onImportProducts(imported);
        setSyncMessage(`Berhasil mengimpor ${imported.length} produk dari Google Sheets!`);
      } else {
        setSyncMessage('Tidak ada data produk yang ditemukan pada lembar Produk.');
      }
    } catch (err: any) {
      setSyncMessage(`Gagal unduh: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setIsCopiedCode(true);
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([APPS_SCRIPT_CODE], { type: 'text/javascript' });
    element.href = URL.createObjectURL(file);
    element.download = 'Code.gs';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Header */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/15 text-emerald-500 rounded-2xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Integrasi Database Google Sheets
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Sinkronisasi inventaris & transaksi penjualan kasir ke Google Sheets secara real-time.
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setActiveSubTab('status')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'status'
                  ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Koneksi & Sinkronisasi
            </button>
            <button
              onClick={() => setActiveSubTab('code')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'code'
                  ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Apps Script (.gs)
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'status' ? (
        <div className="space-y-6">
          {/* Connection Card */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border shadow-sm space-y-6 transition-all ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    config.status === 'connected'
                      ? 'bg-emerald-500 animate-ping'
                      : 'bg-amber-500'
                  }`}
                />
                <div>
                  <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Status Koneksi:{' '}
                    <span
                      className={
                        config.status === 'connected' ? 'text-emerald-500' : 'text-amber-500'
                      }
                    >
                      {config.status === 'connected' ? 'TERHUBUNG REAL-TIME' : 'BELUM TERHUBUNG'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {config.spreadsheetName || 'KasirPintar - Database Toko'}
                  </p>
                </div>
              </div>

              {config.spreadsheetUrl ? (
                <a
                  href={config.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all w-fit cursor-pointer border border-emerald-500/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Spreadsheet Google</span>
                </a>
              ) : (
                <button
                  onClick={handleConnectSheet}
                  disabled={isSyncing}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-98"
                >
                  {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  <span>Sambungkan Sekarang</span>
                </button>
              )}
            </div>

            {/* Sync Notifications */}
            {syncMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{syncMessage}</span>
              </div>
            )}

            {/* Manual Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-850 border-slate-750' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Unggah Inventaris Lokal ke Google Sheet
                </h4>
                <p className="text-[11px] text-slate-400">
                  Kirim seluruh daftar harga, barcode, dan stok dari aplikasi web ini ke spreadsheet.
                </p>
                <button
                  onClick={handleManualPush}
                  disabled={isSyncing || !config.spreadsheetId}
                  className="mt-2 w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sinkronkan Sekarang</span>
                </button>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-850 border-slate-750' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Tarik Data Produk dari Google Sheet
                </h4>
                <p className="text-[11px] text-slate-400">
                  Perbarui stok dan harga di aplikasi kasir mengikuti perubahan yang dibuat di Google Sheets.
                </p>
                <button
                  onClick={handlePullFromSheet}
                  disabled={isSyncing || !config.spreadsheetId}
                  className="mt-2 w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Data dari Sheet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Apps Script (.gs) Code Studio */
        <div
          className={`p-6 sm:p-7 rounded-3xl border shadow-sm space-y-4 transition-all ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Kode Google Apps Script (Code.gs)
              </h3>
              <p className="text-xs text-slate-400">
                Salin atau unduh kode backend Google Apps Script berikut ke Extensions &gt; Apps Script di Google Sheets.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isCopiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
              <button
                onClick={handleDownloadCode}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh .gs</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 max-h-[50vh] overflow-y-auto">
            <pre className="whitespace-pre-wrap">{APPS_SCRIPT_CODE}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
