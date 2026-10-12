import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Globe,
  X,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Cloud,
  Server,
  Share2,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Zap,
  ArrowRight,
  Download,
  Info,
  Wifi,
  WifiOff,
  Database,
  HardDrive,
  Terminal,
  FolderArchive,
  Printer,
  CheckCircle2,
  Github,
  GitBranch,
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { PWAInstallButton } from './PWAInstallButton';

interface OnlineGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const OnlineGuideModal: React.FC<OnlineGuideModalProps> = ({
  isOpen,
  onClose,
  isDark = true,
}) => {
  const isOnline = useOnlineStatus();
  const [activeTab, setActiveTab] = useState<'offline' | 'deploy' | 'hp' | 'sheets' | 'multi'>('offline');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBuildCmd, setCopiedBuildCmd] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [appUrl, setAppUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      setAppUrl(url);

      // Generate instant QR Code for the app URL
      QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((dataUrl) => {
          setQrCodeDataUrl(dataUrl);
        })
        .catch((err) => {
          console.error('Error generating QR code:', err);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl || window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyDeployConfig = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyBuildCmd = () => {
    navigator.clipboard.writeText('npm run build');
    setCopiedBuildCmd(true);
    setTimeout(() => setCopiedBuildCmd(false), 2500);
  };

  const [copiedGitCmd, setCopiedGitCmd] = useState(false);

  const gitCommandsText = `git init
git add .
git commit -m "Deploy KasirPintar POS"
git branch -M main
git remote add origin https://github.com/USERNAME/kasir-pintar.git
git push -u origin main`;

  const handleCopyGitCmd = () => {
    navigator.clipboard.writeText(gitCommandsText);
    setCopiedGitCmd(true);
    setTimeout(() => setCopiedGitCmd(false), 2500);
  };

  const vercelConfig = `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md transition-all">
      <div
        className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-black/80'
            : 'bg-white border-slate-200 text-slate-800 shadow-slate-900/20'
        }`}
      >
        {/* Header Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              {isOnline ? (
                <Wifi className="w-6 h-6 text-emerald-200 animate-pulse" />
              ) : (
                <WifiOff className="w-6 h-6 text-amber-300 animate-bounce" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">Pusat Hosting & Mode Offline Kasir</h3>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 ${
                    isOnline
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-slate-950 animate-ping' : 'bg-slate-950'}`} />
                  {isOnline ? 'Online Aktif' : 'Mode Offline Aktif'}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium">
                Kasir siap berjalan tanpa kuota (offline) dan siap di-hosting ke domain sendiri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live URL & Status Bar Strip */}
        <div
          className={`px-6 py-3.5 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 ${
            isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative flex h-3 w-3 shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOnline ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Status Saat Ini: {isOnline ? 'Tersambung Internet (Cloud Siap)' : 'Offline (Data Aman di Memori Lokal)'}
              </div>
              <div className="font-mono text-xs font-semibold truncate text-emerald-400">
                {appUrl || 'Sedang memuat link aplikasi...'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                copiedLink
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'
              }`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link Web'}</span>
            </button>

            <a
              href={appUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Tab Baru</span>
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex border-b px-6 gap-2 overflow-x-auto shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50/50'
          }`}
        >
          <button
            onClick={() => setActiveTab('offline')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'offline'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4 text-amber-400" />
            <span>1. Cara Pakai Offline (Tanpa Internet)</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'deploy'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4 text-emerald-400" />
            <span>2. Panduan Hosting Sendiri (Vercel / cPanel)</span>
          </button>

          <button
            onClick={() => setActiveTab('hp')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'hp'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>3. Buka & Pasang di HP (PWA)</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-4 h-4 text-teal-400" />
            <span>4. Cloud Sync Google Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('multi')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'multi'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>5. Pengaturan Multi-Kasir</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CARA PAKAI OFFLINE */}
          {activeTab === 'offline' && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div
                className={`p-5 rounded-2xl border flex items-start gap-4 ${
                  isDark
                    ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-amber-400">
                    Aplikasi Ini 100% Siap Beroperasi Tanpa Internet (Offline)
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    Sistem telah dilengkapi <strong>Service Worker Cache & Local Database</strong>. Jika WiFi toko mati, listrik padam, atau kuota internet habis, kasir tetap bisa dibuka dan tetap bisa melayani pembeli seperti biasa tanpa hambatan!
                  </p>
                </div>
              </div>

              {/* What works offline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-400 mb-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Scan Barcode & Jual</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Kamera scan barcode produk, cari nama barang, tambah keranjang belanja, dan hitung diskon serta kembalian berjalan normal.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-400 mb-2">
                    <Printer className="w-4 h-4 shrink-0" />
                    <span>Cetak Struk Thermal</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Struk belanja thermal (58mm/80mm) dan cetak nota fisik melalui printer bluetooth/kabel tetap berfungsi normal tanpa internet.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-400 mb-2">
                    <Database className="w-4 h-4 shrink-0" />
                    <span>Stok & Riwayat Lokal</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Setiap pengurangan stok barang dan riwayat nota langsung disimpan di memori HP/komputer lokal (*LocalStorage*).
                  </p>
                </div>
              </div>

              {/* How to use offline step-by-step */}
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h4 className="font-bold text-sm flex items-center gap-2 text-emerald-400">
                  <Zap className="w-4 h-4" />
                  <span>3 Langkah Menggunakan Kasir Secara Offline:</span>
                </h4>
                <ol
                  className={`list-decimal list-inside space-y-2 text-xs font-medium pl-1 leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  <li>
                    <strong>Buka aplikasi minimal 1 kali saat online</strong> (atau pasang via tombol <em>&quot;Install Kasir&quot;</em> / PWA di HP). Saat pertama kali dibuka, browser otomatis menyimpan seluruh kode kasir ke memori offline.
                  </li>
                  <li>
                    <strong>Saat internet mati:</strong> Buka kasir seperti biasa dari ikon di layar HP atau buka link web. Aplikasi akan langsung terbuka tanpa loading layar putih!
                  </li>
                  <li>
                    <strong>Saat internet tersambung kembali:</strong> Masuk ke tab <em>&quot;Database Google Sheets&quot;</em> dan klik <em>&quot;Sinkronkan Sekarang&quot;</em> untuk mengunggah transaksi yang sempat dicatat secara offline ke cloud.
                  </li>
                </ol>
              </div>

              {/* Offline Test Simulation banner */}
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="text-xs">
                  <strong>Uji coba mandiri:</strong> Nyalakan <em>Mode Pesawat (Airplane Mode)</em> di HP atau matikan WiFi laptop Anda, lalu coba buka kasir dan lakukan transaksi. Anda akan melihat kasir tetap berjalan lancar!
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PANDUAN HOSTING LENGKAP */}
          {activeTab === 'deploy' && (
            <div className="space-y-6">
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-emerald-400">
                  <Server className="w-4 h-4" />
                  <span>Bagaimana Cara Memasang (Hosting) Kasir ke Web / Domain Sendiri?</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aplikasi ini merupakan aplikasi web modern (React + Vite SPA) yang sangat ringan dan tidak membutuhkan server database berat. Anda bisa menghostingnya secara <strong>GRATIS SELAMANYA</strong> di Vercel, Netlify, Firebase Hosting, atau ke cPanel hosting web toko Anda sendiri!
                </p>
              </div>

              {/* Build Command Bar */}
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Perintah Build Produksi (Menghasilkan folder dist/):
                  </div>
                  <div className="font-mono text-sm text-emerald-400 font-bold mt-0.5">
                    $ npm run build
                  </div>
                </div>
                <button
                  onClick={handleCopyBuildCmd}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  {copiedBuildCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBuildCmd ? 'Perintah Tersalin!' : 'Salin Perintah'}</span>
                </button>
              </div>

              {/* GitHub Pages Automated Deployment Card */}
              <div
                className={`p-5 rounded-2xl border space-y-3.5 ${
                  isDark ? 'bg-slate-950/70 border-slate-700/80' : 'bg-slate-50 border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-800 text-white rounded-xl shadow-xs">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>Deploy Langsung ke GitHub Pages</span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                          GitHub Actions Siap Pakai
                        </span>
                      </h5>
                      <p className="text-xs text-slate-400">
                        File alur kerja <code>.github/workflows/deploy.yml</code> & konfigurasi <code>base: &apos;./&apos;</code> sudah terpasang otomatis.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyGitCmd}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer w-fit"
                  >
                    {copiedGitCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedGitCmd ? 'Perintah Git Tersalin!' : 'Salin Perintah Git'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      Langkah 1: Push ke GitHub
                    </span>
                    <pre
                      className={`p-3 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed ${
                        isDark ? 'bg-slate-900 border border-slate-800 text-slate-300' : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      {gitCommandsText}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      Langkah 2: Aktifkan Pages di GitHub
                    </span>
                    <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1.5 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                      <li>Buka repositori Anda di <strong>github.com</strong>.</li>
                      <li>Klik tab <strong>Settings</strong> &gt; menu <strong>Pages</strong> di sebelah kiri.</li>
                      <li>Di bagian <strong>Build and deployment &gt; Source</strong>, pilih: <strong className="text-emerald-400">GitHub Actions</strong>.</li>
                      <li>Tunggu 1 menit, website kasir Anda langsung online di:</li>
                      <li className="font-mono text-emerald-400 text-[11px] list-none pt-1">
                        👉 https://USERNAME.github.io/kasir-pintar/
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Hosting Platforms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Opsi A: Vercel */}
                <div
                  className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm flex items-center gap-1.5 text-emerald-400">
                      <span>▲</span> Vercel (Paling Direkomendasikan)
                    </span>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      100% Gratis
                    </span>
                  </div>
                  <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1.5 leading-relaxed">
                    <li>Upload kode ini ke repositori <strong>GitHub</strong> Anda.</li>
                    <li>Buka <strong>vercel.com</strong> dan login dengan akun GitHub Anda.</li>
                    <li>Klik <strong>&quot;Add New Project&quot;</strong> lalu pilih repositori kasir.</li>
                    <li>Vercel otomatis mendeteksi Vite & file <code>vercel.json</code> yang sudah kami sertakan.</li>
                    <li>Klik <strong>Deploy</strong>. Selesai dalam 1 menit! Anda bisa pasang domain kustom toko Anda.</li>
                  </ol>
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                      <span>File vercel.json (Sudah Aktif):</span>
                      <button
                        onClick={() => handleCopyDeployConfig(vercelConfig)}
                        className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>Salin</span>
                      </button>
                    </div>
                    <pre
                      className={`p-2.5 rounded-xl text-[10px] font-mono overflow-x-auto ${
                        isDark ? 'bg-slate-900 border border-slate-800 text-slate-300' : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {vercelConfig}
                    </pre>
                  </div>
                </div>

                {/* Opsi B: Netlify (Drag & Drop) */}
                <div
                  className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm flex items-center gap-1.5 text-teal-400">
                      <FolderArchive className="w-4 h-4" /> Netlify (Bisa Drag-and-Drop)
                    </span>
                    <span className="text-[10px] bg-teal-500/15 text-teal-400 px-2 py-0.5 rounded-full font-bold">
                      Mudah
                    </span>
                  </div>
                  <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1.5 leading-relaxed">
                    <li>Jalankan <code>npm run build</code> di komputer Anda.</li>
                    <li>Akan tercipta folder <strong>dist/</strong>.</li>
                    <li>Buka <strong>netlify.com/drop</strong> di browser.</li>
                    <li>Cukup tarik (drag & drop) folder <strong>dist/</strong> tersebut ke browser Netlify!</li>
                    <li>Website kasir langsung online dan mendapatkan link publik gratis serta SSL HTTPS.</li>
                  </ol>
                  <div className="pt-2 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    File <code>netlify.toml</code> untuk rute otomatis sudah tersedia di dalam proyek ini.
                  </div>
                </div>

                {/* Opsi C: cPanel Hosting Toko Biasa */}
                <div
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm flex items-center gap-1.5 text-amber-400">
                      <HardDrive className="w-4 h-4" /> cPanel Hosting Biasa
                    </span>
                    <span className="text-[10px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                      Domain Sendiri
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Punya hosting cPanel seperti Niagahoster, DomaiNesia, RumahWeb, atau IDCloudHost?
                  </p>
                  <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1">
                    <li>Jalankan <code>npm run build</code>.</li>
                    <li>Buka <strong>cPanel &gt; File Manager &gt; public_html</strong>.</li>
                    <li>Upload seluruh file di dalam folder <code>dist/</code> ke sana.</li>
                    <li>Kasir langsung dapat dibuka di domain <code>namatokoanda.com</code>!</li>
                  </ol>
                </div>

                {/* Opsi D: Firebase Hosting */}
                <div
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm flex items-center gap-1.5 text-blue-400">
                      <Terminal className="w-4 h-4" /> Firebase Hosting
                    </span>
                    <span className="text-[10px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                      Google Cloud
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Karena Firebase Auth dan Project Google sudah terhubung di aplikasi ini:
                  </p>
                  <div
                    className={`p-2.5 rounded-xl font-mono text-xs space-y-1 ${
                      isDark ? 'bg-slate-900 text-blue-300 border border-slate-800' : 'bg-slate-100 text-blue-700'
                    }`}
                  >
                    <div>$ npm run build</div>
                    <div>$ npx firebase deploy --only hosting</div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Aplikasi langsung live di alamat <code>*.web.app</code> dan <code>*.firebaseapp.com</code>!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BUKA & PASANG DI HP (PWA) */}
          {activeTab === 'hp' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* QR Code Section */}
              <div
                className={`md:col-span-5 p-5 rounded-2xl border text-center flex flex-col items-center ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Scan Cepat dengan Kamera HP
                </div>
                {qrCodeDataUrl ? (
                  <div className="bg-white p-3 rounded-2xl shadow-xl inline-block border-4 border-emerald-500/30">
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code KasirPintar"
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-500">
                    Membuat QR Code...
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-3 font-medium">
                  Arahkan kamera HP kasir Anda ke barcode di atas untuk langsung membuka kasir di ponsel.
                </p>
                <button
                  onClick={handleCopyLink}
                  className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Kirim Link via WhatsApp / Catatan</span>
                </button>
              </div>

              {/* Step by step installation */}
              <div className="md:col-span-7 space-y-4">
                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Aplikasi ini adalah PWA (Progressive Web App)</span>
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed">
                    Bisa di-install langsung dari browser ke layar depan HP tanpa perlu download dari Google Play Store atau App Store!
                  </p>
                  <div className="mt-3">
                    <PWAInstallButton variant="hero" isDark={isDark} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-black">
                      A
                    </span>
                    <span>Untuk HP Android (Google Chrome):</span>
                  </h4>
                  <ol
                    className={`list-decimal list-inside space-y-2 text-xs pl-2 font-medium leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <li>Buka link aplikasi di browser <strong>Google Chrome</strong> di HP kasir.</li>
                    <li>
                      Ketuk tombol <strong>titik tiga (⋮)</strong> di sudut kanan atas browser.
                    </li>
                    <li>
                      Pilih menu <strong>&quot;Tambahkan ke Layar Utama&quot;</strong> (atau <em>&quot;Instal Aplikasi&quot;</em>).
                    </li>
                    <li>
                      Beri nama <strong>KasirPintar</strong> lalu tekan <strong>Instal</strong>.
                    </li>
                    <li>
                      Ikon kasir akan muncul di menu HP Anda. Saat dibuka, aplikasi akan langsung berjalan <strong>layar penuh (fullscreen)</strong> tanpa address bar!
                    </li>
                  </ol>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-black">
                      B
                    </span>
                    <span>Untuk iPhone / iPad (Safari):</span>
                  </h4>
                  <ol
                    className={`list-decimal list-inside space-y-2 text-xs pl-2 font-medium leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <li>Buka link aplikasi di browser <strong>Safari</strong> di iPhone/iPad.</li>
                    <li>
                      Tekan ikon <strong>Bagikan / Share</strong> (kotak dengan panah ke atas) di bagian bawah.
                    </li>
                    <li>
                      Gulir ke bawah dan ketuk <strong>&quot;Tambah ke Layar Utama&quot; (Add to Home Screen)</strong>.
                    </li>
                    <li>Tekan <strong>Tambah</strong> di kanan atas. Selesai!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLOUD SYNC GOOGLE SHEETS */}
          {activeTab === 'sheets' && (
            <div className="space-y-5">
              <div
                className={`p-5 rounded-2xl border flex items-start gap-4 ${
                  isDark ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-emerald-400">
                    Otomatisasi Cloud ke Google Sheets Pemilik Toko
                  </h4>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Dengan mengaktifkan sinkronisasi Google Sheets, setiap kali kasir menyelesaikan transaksi di HP atau komputer mana pun, rincian penjualan, keuntungan bersih, dan stok barang akan langsung tersimpan di file Google Sheets akun Google Drive Anda.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">1</span>
                    Buka Menu Sheets
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Masuk ke menu <strong>&quot;Database Google Sheets&quot;</strong> di sidebar kiri aplikasi.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">2</span>
                    Hubungkan Akun Google
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tekan tombol <strong>&quot;Masuk dengan Google&quot;</strong> dan izinkan akses Google Sheets & Drive toko Anda.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">3</span>
                    Sinkron Otomatis
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tekan <strong>&quot;Buat Spreadsheet Baru&quot;</strong>. Sistem akan membuat sheet resmi dan menyinkronkan data secara instan!
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="text-xs text-slate-400">
                  Ingin memantau penjualan saat tidak berada di toko? Anda cukup buka Google Sheets di HP Anda!
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  Buka Menu Google Sheets
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: MULTI-PENGGUNA & KASIR */}
          {activeTab === 'multi' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h4 className="font-bold text-sm mb-1 text-emerald-400">
                  Cara Kasir & Pemilik Toko Menggunakan dari Perangkat Berbeda
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Setiap staf toko memiliki peran dan PIN login masing-masing untuk menjaga keamanan kasir:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-bold text-sm">Role Admin (Pemilik Toko)</div>
                      <div className="text-[11px] text-slate-400">Akses Penuh</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bisa melihat laporan keuangan, mengatur harga & stok barang, mengelola user kasir, dan menghubungkan Google Sheets.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                      <Users className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-bold text-sm">Role Kasir (Staf Penjualan)</div>
                      <div className="text-[11px] text-slate-400">Khusus Transaksi POS</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tampilan disederhanakan: Hanya kasir penjualan dan pengecekan sisa stok barang, tanpa menu keuangan sensitif.
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border text-xs text-slate-400 leading-relaxed flex items-center gap-3 ${
                  isDark ? 'bg-amber-950/20 border-amber-800/40 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                <Info className="w-5 h-5 shrink-0" />
                <span>
                  Tip: Anda bisa menambah petugas kasir baru dengan nama dan PIN khusus di menu <strong>&quot;Manajemen Pengguna&quot;</strong>.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between gap-3 shrink-0 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="text-xs text-slate-400 hidden sm:block">
            Semua fitur kasir, barcode, cetak struk, dan pencatatan stok siap dipakai offline maupun online.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
