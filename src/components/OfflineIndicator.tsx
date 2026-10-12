import React, { useState } from 'react';
import { Wifi, WifiOff, CheckCircle2, ChevronRight, X, Database } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  onOpenOnlineGuide?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ onOpenOnlineGuide }) => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  // If online and dismissed, don't show; if online, show a small discreet pill or nothing
  if (isOnline) {
    return null;
  }

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-xl hover:bg-amber-400 transition-all cursor-pointer animate-pulse"
        title="Klik untuk melihat status offline kasir"
      >
        <WifiOff className="w-3.5 h-3.5" />
        <span>Mode Offline Aktif</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-950/95 border-2 border-amber-500/80 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
          <WifiOff className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">
              Mode Offline Aktif
            </h4>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              title="Tutup Pesan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            Koneksi internet terputus, tapi <strong>kasir tetap dapat berjualan secara normal!</strong>
          </p>
          <div className="mt-2 text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex items-center gap-1.5">
            <Database className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Stok, transaksi, dan cetak struk tersimpan di perangkat lokal.</span>
          </div>
          {onOpenOnlineGuide && (
            <button
              onClick={onOpenOnlineGuide}
              className="mt-2.5 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Panduan Offline & Hosting</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
