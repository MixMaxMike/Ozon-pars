import React from 'react';
import { ParseProgress } from '../types/ozon';
import { Loader2, CheckCircle2, Shield, Search, Database, FileSpreadsheet } from 'lucide-react';

interface ProgressBarProps {
  progress: ParseProgress | null;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  if (!progress) return null;

  return (
    <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300 ease-out"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>{progress.currentStep}</span>
            </h4>
            {progress.currentUrl && (
              <p className="text-xs text-slate-400 font-mono truncate max-w-md">
                {progress.currentUrl}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-xs text-slate-400">Обработано</div>
            <div className="text-sm font-bold text-slate-200">
              {progress.processedItems} / {progress.totalItems} тов.
            </div>
          </div>
          <div className="text-2xl font-black text-blue-400 font-mono">
            {progress.percent}%
          </div>
        </div>
      </div>

      {/* Индикаторы этапов */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
        <div className={`flex items-center gap-1.5 ${progress.percent >= 25 ? 'text-blue-400 font-medium' : ''}`}>
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">1. Каталог</span>
        </div>
        <div className={`flex items-center gap-1.5 ${progress.percent >= 50 ? 'text-blue-400 font-medium' : ''}`}>
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">2. Цены & Атрибуты</span>
        </div>
        <div className={`flex items-center gap-1.5 ${progress.percent >= 75 ? 'text-blue-400 font-medium' : ''}`}>
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">3. Фотографии CDN</span>
        </div>
        <div className={`flex items-center gap-1.5 ${progress.percent >= 99 ? 'text-emerald-400 font-medium' : ''}`}>
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">4. Экспорт Excel</span>
        </div>
      </div>
    </div>
  );
};
