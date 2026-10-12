import React, { useState } from 'react';
import { Download, Smartphone, Check, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'hero' | 'sidebar';
  isDark?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  isDark = true,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running inside standalone PWA mode, don't show the install button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Android / Desktop in-app prompt
  if (isInstallable) {
    if (variant === 'sidebar') {
      return (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
            <span>Install Aplikasi</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-md">
            PWA
          </span>
        </button>
      );
    }

    if (variant === 'hero') {
      return (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <Download className="w-4 h-4 animate-bounce" />
          <span>{isInstalling ? 'Memasang...' : 'Pasang Aplikasi di HP (PWA)'}</span>
        </button>
      );
    }

    // Default: Header button
    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
          isDark
            ? 'bg-emerald-600/90 text-white border-emerald-500 hover:bg-emerald-500 shadow-sm shadow-emerald-950'
            : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-2xs'
        }`}
        title="Pasang aplikasi di HP atau Komputer Anda"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span className="hidden sm:inline">Install Kasir</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            isDark
              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-2xs'
          }`}
          title="Petunjuk Pasang di iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Install di iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div
              className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm">Pasang di iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    Tekan tombol <strong>Bagikan / Share</strong> (ikon <Share2 className="w-3 h-3 inline text-blue-400" /> di Safari).
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    Gulir ke bawah dan ketuk <strong>&quot;Tambah ke Layar Utama&quot;</strong> (<em>Add to Home Screen</em>).
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    3
                  </span>
                  <span>
                    Ketuk <strong>Tambah</strong> di pojok kanan atas. Aplikasi akan muncul di layar iPhone Anda!
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
