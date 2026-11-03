import React from 'react';
import { Download, FileSpreadsheet, KeyRound, Zap, Layers, Sparkles, Terminal } from 'lucide-react';

interface HeaderProps {
  onExportExcel: () => void;
  onExportCsv: () => void;
  productsCount: number;
  isParsing: boolean;
  onStartParse: () => void;
  onOpenDeepCollector: () => void;
  onOpenSellerApi: () => void;
  onOpenGoogleSheets: () => void;
  isSellerApiConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onExportExcel,
  onExportCsv,
  productsCount,
  isParsing,
  onStartParse,
  onOpenDeepCollector,
  onOpenSellerApi,
  onOpenGoogleSheets,
  isSellerApiConnected
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-xl backdrop-blur-md bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Бренд и заголовок */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <FileSpreadsheet className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight">
                Ozon Data Platform <span className="text-blue-400 font-extrabold">→ Excel</span>
              </h1>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                100% Каталога
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Титан-GS • Все 5 ссылок • Лист «Всё в одном» + 5 детальных листов • Все фото отдельно
            </p>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          {/* Кнопка глубокого сборщика */}
          <button
            onClick={onOpenDeepCollector}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-all"
            title="Инструкция и скрипт для снятия Virtual DOM и сбора 100% товаров на Ozon"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Авто-скроллер 100%</span>
          </button>

          {/* Кнопка Seller API */}
          <button
            onClick={onOpenSellerApi}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isSellerApiConnected
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Официальный Ozon Seller API (Контур 1 ТЗ)"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSellerApiConnected ? 'Seller API: Активен' : 'Seller API'}</span>
          </button>

          {/* Количество товаров */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Всего: <strong className="text-white font-semibold">{productsCount}</strong> тов.</span>
          </div>

          {/* Главная кнопка В 1 КЛИК */}
          <button
            onClick={onStartParse}
            disabled={isParsing}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-md active:scale-95 ${
              isParsing
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30 hover:shadow-blue-600/50'
            }`}
          >
            {isParsing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Сбор 100%...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Собрать всё</span>
              </>
            )}
          </button>

          {/* Кнопка Google Таблицы */}
          <button
            onClick={onOpenGoogleSheets}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/50 text-xs sm:text-sm font-medium transition-all shadow-md shadow-emerald-900/30 active:scale-95"
            title="Интеграция с Google Таблицами: прямая выгрузка и Google Apps Script"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Google Таблицы</span>
          </button>

          {/* Кнопка скачать Excel с мульти-листами */}
          <button
            onClick={onExportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 active:scale-95"
            title="Скачать полный Excel (.xlsx) с листом «Все данные (Всё в одном)» и отдельными листами по разделам"
          >
            <Download className="w-4 h-4" />
            <span>Excel (.xlsx) Все данные</span>
          </button>
        </div>
      </div>
    </header>
  );
};
